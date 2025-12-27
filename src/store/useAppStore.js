import { create } from 'zustand';
import { extractImagesFromPdf } from '../services/pdf-service';
import { validateApiKey, generateImageDescription, generateSummary } from '../services/gemini-service';
import { blobToBase64, createZip } from '../services/file-utils';

const useAppStore = create((set, get) => ({
  // --- UI State ---
  appState: 'LANDING', // LANDING, UPLOAD, PROCESSING, RESULTS, ERROR
  setAppState: (state) => set({ appState: state }),

  // --- File State ---
  file: null,
  setFile: (file) => set({ file }),
  processingProgress: 0,
  processingStatusText: '',
  errorDetails: { title: '', message: '' },

  // --- Results State ---
  extractedPhotos: [],
  extractedIcons: [],
  zipBlob: null,
  visualSummary: '',
  isSummarizing: false,

  // --- AI / Settings State ---
  apiKey: '',
  keyValidated: false,
  isValidatingKey: false,
  detectedTier: 'paid', // 'paid' (high limits) or 'free' (low limits)
  aiEnabled: false,
  isAnalyzing: false,
  analysisProgress: 0,
  usageStats: {
    requestsTotal: 0,
    tokensTotal: 0,
    rpmCount: 0,
    startTime: Date.now()
  },
  useSmartExtraction: true,

  // --- Actions ---

  setApiKey: (key) => set({ apiKey: key, keyValidated: false }),
  setUseSmartExtraction: (val) => set({ useSmartExtraction: val }),

  resetState: () => set((state) => ({
    appState: 'UPLOAD',
    file: null,
    extractedPhotos: [],
    extractedIcons: [],
    zipBlob: null,
    processingProgress: 0,
    aiEnabled: false,
    keyValidated: false, // reset validation to force re-check if needed, or keep? Original reset cleared it.
    apiKey: '', // Original reset cleared it.
    usageStats: { requestsTotal: 0, tokensTotal: 0, rpmCount: 0, startTime: Date.now() },
    visualSummary: ''
  })),

  // Validate API Key
  checkApiKey: async () => {
    const { apiKey } = get();
    if (!apiKey) return;

    set({ isValidatingKey: true });
    const result = await validateApiKey(apiKey);

    if (result.valid) {
      set({
        keyValidated: true,
        detectedTier: result.tier,
        isValidatingKey: false
      });
      if (result.tier === 'free') {
        alert("API Key Verified. Note: Google indicates rate limiting. Switched to 'Free Tier' mode.");
      }
    } else {
      set({ isValidatingKey: false, keyValidated: false });
      alert(`Invalid API Key: ${result.error}`);
    }
  },

  removeApiKey: () => set({
    apiKey: '',
    keyValidated: false,
    detectedTier: 'paid',
    usageStats: { requestsTotal: 0, tokensTotal: 0, rpmCount: 0, startTime: Date.now() },
    aiEnabled: false,
    visualSummary: ''
  }),

  // PDF Processing
  startExtraction: async () => {
    const { file, useSmartExtraction } = get();
    if (!file) return;

    set({
      appState: 'PROCESSING',
      processingProgress: 0,
      processingStatusText: 'Initializing PDF Engine...',
      extractedPhotos: [],
      extractedIcons: [],
      aiEnabled: false,
      visualSummary: ''
    });

    try {
      const results = await extractImagesFromPdf(
        file,
        useSmartExtraction,
        (progress, text) => set({ processingProgress: progress, processingStatusText: text })
      );

      // Create initial ZIP (without AI data)
      const zipBlob = await createZip(results.photos, results.icons, false);

      set({
        extractedPhotos: results.photos,
        extractedIcons: results.icons,
        zipBlob,
        appState: 'RESULTS',
        processingProgress: 100
      });

    } catch (error) {
        let title = "Processing Error";
        let message = "An unexpected error occurred.";

        if (error.message === "NO_IMAGES") {
             title = useSmartExtraction ? "Deep Scan Found 0 Images" : "Extraction Failed";
             message = useSmartExtraction
                ? "We checked all layers but found no images. Try 'Convert Pages to Images' mode."
                : "Could not convert pages to images. The file might be corrupted.";
        } else if (error.name === "PasswordException") {
            title = "Encrypted PDF";
            message = "This PDF is password protected. Please unlock it and try again.";
        }

        set({
            appState: 'ERROR',
            errorDetails: { title, message }
        });
    }
  },

  // AI Analysis Logic
  runAiAnalysis: async () => {
    const { extractedPhotos, apiKey, detectedTier, extractedIcons } = get();
    set({ isAnalyzing: true, analysisProgress: 0 });

    let photosToAnalyze = [...extractedPhotos];
    // Filter for photos that don't have AI data yet
    const pendingIndices = photosToAnalyze
      .map((photo, index) => photo.aiData ? -1 : index)
      .filter(index => index !== -1);

    const totalToProcess = pendingIndices.length;
    let processedCount = 0;

    let currentTier = detectedTier;
    let batchSize = currentTier === 'paid' ? 5 : 1;
    let delayBetween = currentTier === 'paid' ? 200 : 4000;

    let i = 0;
    while (i < totalToProcess) {
       // Check if we need to downgrade dynamically
       if (currentTier === 'free') {
           batchSize = 1;
           delayBetween = 4000;
       }

       const currentBatch = pendingIndices.slice(i, i + batchSize);
       let rateLimitHitInBatch = false;

       await Promise.all(currentBatch.map(async (index) => {
           const photo = photosToAnalyze[index];
           try {
               const base64 = await blobToBase64(photo.blob);
               let attempts = 0;
               let success = false;

               while (attempts < 3 && !success) {
                   try {
                       const result = await generateImageDescription(base64, apiKey);
                       if (result && result.data) {
                           photosToAnalyze[index] = {
                               ...photo,
                               aiData: result.data,
                               fileName: `${result.data.filename}.jpg`
                           };
                           // Update usage stats
                           set((state) => ({
                               usageStats: {
                                   ...state.usageStats,
                                   requestsTotal: state.usageStats.requestsTotal + 1,
                                   tokensTotal: state.usageStats.tokensTotal + result.tokens,
                                   rpmCount: state.usageStats.rpmCount + 1
                               }
                           }));
                           success = true;
                       }
                   } catch (err) {
                       if (err.message === "RATE_LIMIT") {
                           rateLimitHitInBatch = true;
                           attempts++;
                           await new Promise(r => setTimeout(r, 2000 * Math.pow(2, attempts)));
                       } else {
                           throw err;
                       }
                   }
               }
           } catch (err) {
               console.warn(`Analysis failed for image ${index}`, err);
           } finally {
               processedCount++;
               const totalProgress = Math.round(((extractedPhotos.length - totalToProcess + processedCount) / extractedPhotos.length) * 100);
               set({ analysisProgress: totalProgress });
           }
       }));

       if (rateLimitHitInBatch && currentTier === 'paid') {
           console.warn("Rate limit hit! Auto-downgrading to Free Tier limits.");
           currentTier = 'free';
           set({ detectedTier: 'free' });
           batchSize = 1;
           delayBetween = 4000;
       }

       i += batchSize;
       if (i < totalToProcess) {
           await new Promise(r => setTimeout(r, delayBetween));
       }
    }

    // Regenerate ZIP with new metadata
    const newZipBlob = await createZip(photosToAnalyze, extractedIcons, true);

    set({
        extractedPhotos: photosToAnalyze,
        aiEnabled: true,
        isAnalyzing: false,
        zipBlob: newZipBlob
    });
  },

  // Summary Generation
  runSummaryGeneration: async () => {
      const { extractedPhotos, apiKey, aiEnabled } = get();
      if (!aiEnabled || !apiKey) return;

      set({ isSummarizing: true });

      const descriptions = extractedPhotos
        .filter(p => p.aiData)
        .map((p, i) => `Image ${i + 1}: ${p.aiData.description}`)
        .join("\n");

      if (!descriptions) {
          set({ isSummarizing: false });
          return;
      }

      const result = await generateSummary(descriptions, apiKey);
      if (result) {
          set((state) => ({
              visualSummary: result.text,
              usageStats: {
                  ...state.usageStats,
                  requestsTotal: state.usageStats.requestsTotal + 1,
                  tokensTotal: state.usageStats.tokensTotal + result.tokens
              }
          }));
      }
      set({ isSummarizing: false });
  }

}));

export default useAppStore;
