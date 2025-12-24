import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FileText, ArrowRight, Image as ImageIcon, Upload, CheckCircle, AlertTriangle, XCircle, Loader2, Download, RefreshCw, Eye, Camera, Settings2, Grid, Layers, Sparkles, Key, ShieldCheck, BrainCircuit, Database, Lock, Unlock, BarChart3, Zap, Activity, Clock, Cpu, Trash2, Coins, Gauge, Info, FileJson, ChevronLeft } from 'lucide-react';
import PixelSnow from './PixelSnow';

// --- Script Loader Helper ---
const loadScript = (src) => {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = src;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const LIBRARIES = {
  pdfjs: 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  jszip: 'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  fileSaver: 'https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js'
};

// --- LANDING PAGE CSS (Kinetic Quicksilver Theme with PixelSnow) ---
const LANDING_STYLES = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;500;700&family=Inter:wght@400;600&display=swap');

    .landing-root {
        --bg-color: #030712;
        --accent-primary: #00d2ff;
        --accent-secondary: #3a7bd5;
        --silver-flux: linear-gradient(135deg, #e2e8f0 0%, #94a3b8 50%, #f8fafc 100%);
        --glass: rgba(255, 255, 255, 0.03);
        --border-glass: rgba(255, 255, 255, 0.1);
        
        background-color: var(--bg-color);
        color: #fff;
        font-family: 'Inter', sans-serif;
        
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow-y: auto;
        
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        
        padding: 20px;
    }

    /* Snow Background Container */
    .snow-background {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 0;
        pointer-events: none;
    }

    /* Main Container */
    .landing-container {
        position: relative;
        width: 100%;
        max-width: 800px;
        padding: 50px 40px;
        text-align: center;
        backdrop-filter: blur(20px);
        background: rgba(10, 15, 30, 0.85);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 40px;
        box-shadow: 0 25px 80px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(59, 130, 246, 0.1);
        animation: entry 1.2s cubic-bezier(0.16, 1, 0.3, 1);
        transform-style: preserve-3d;
        z-index: 1;
        margin: auto;
    }

    @keyframes entry {
        from { opacity: 0; transform: translateY(30px) scale(0.95); }
        to { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* Logo Area */
    .logo-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        margin-bottom: 32px;
    }

    .logo-icon {
        width: 42px;
        height: 42px;
        background: var(--silver-flux);
        mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .98 4.96 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-.98-4.96 2.5 2.5 0 0 0 0-5z'/%3E%3Cpath d='M12 4.5V19.5'/%3E%3Cpath d='M12 7.5h3.5a2.5 2.5 0 0 1 0 5H12'/%3E%3Cpath d='M12 12.5h5.5a2.5 2.5 0 0 1 0 5H12'/%3E%3C/svg%3E") no-repeat center;
        -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .98 4.96 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-.98-4.96 2.5 2.5 0 0 0 0-5z'/%3E%3Cpath d='M12 4.5V19.5'/%3E%3Cpath d='M12 7.5h3.5a2.5 2.5 0 0 1 0 5H12'/%3E%3Cpath d='M12 12.5h5.5a2.5 2.5 0 0 1 0 5H12'/%3E%3C/svg%3E") no-repeat center;
    }

    .brand-name {
        font-family: 'Space Grotesk', sans-serif;
        font-weight: 700;
        font-size: 28px;
        letter-spacing: -0.5px;
        background: var(--silver-flux);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    /* Typography */
    .landing-title {
        font-family: 'Space Grotesk', sans-serif;
        font-size: 64px;
        line-height: 1.1;
        font-weight: 700;
        margin-bottom: 20px;
        background: linear-gradient(180deg, #fff 0%, #94a3b8 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        letter-spacing: -2px;
    }

    .landing-subtitle {
        font-size: 18px;
        color: #94a3b8;
        margin-bottom: 40px;
        font-weight: 400;
    }

    /* AI Badge */
    .ai-badge {
        display: inline-flex;
        flex-direction: column;
        gap: 8px;
        padding: 20px 28px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%);
        border: 1px solid rgba(59, 130, 246, 0.25);
        margin-bottom: 40px;
        position: relative;
        overflow: hidden;
        max-width: 100%;
    }

    .ai-badge::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: linear-gradient(45deg, transparent, rgba(255,255,255,0.05), transparent);
        transform: rotate(45deg);
        animation: shine 4s infinite linear;
    }

    @keyframes shine {
        0% { transform: translateX(-100%) rotate(45deg); }
        100% { transform: translateX(100%) rotate(45deg); }
    }

    .ai-header {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        color: #38bdf8;
        font-weight: 600;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: 2px;
    }

    .ai-desc {
        font-size: 14px;
        color: #cbd5e1;
        max-width: 320px;
        line-height: 1.5;
    }

    /* Button - Quicksilver Flux */
    .cta-button {
        position: relative;
        padding: 18px 44px;
        font-size: 17px;
        font-weight: 600;
        color: #030712;
        background: var(--silver-flux);
        border: none;
        border-radius: 100px;
        cursor: pointer;
        overflow: hidden;
        transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        display: inline-flex;
        align-items: center;
        gap: 12px;
        box-shadow: 0 4px 20px rgba(255, 255, 255, 0.15);
    }

    .cta-button:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 20px 40px -10px rgba(255, 255, 255, 0.25);
    }

    .cta-button svg {
        transition: transform 0.4s ease;
    }

    .cta-button:hover svg {
        transform: translateX(5px);
    }

    /* Privacy Pill */
    .privacy-pill {
        margin-top: 40px;
        display: inline-flex;
        align-items: center;
        gap: 10px;
        padding: 10px 20px;
        background: rgba(0, 0, 0, 0.4);
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 100px;
        font-size: 12px;
        color: #64748b;
        max-width: 100%;
        text-align: center;
    }

    .privacy-pill svg {
        width: 14px;
        color: #10b981;
        flex-shrink: 0;
    }

    /* Footer */
    .landing-footer {
        margin-top: 40px;
        width: 100%;
        font-size: 11px;
        color: #475569;
        letter-spacing: 1px;
    }

    .landing-footer a {
        color: #94a3b8;
        text-decoration: none;
        transition: color 0.3s;
    }

    .landing-footer a:hover { color: #fff; }

    /* Responsive - Mobile First */
    @media (max-width: 768px) {
        .landing-root {
            padding: 16px;
        }
        .landing-title { 
            font-size: 40px; 
            letter-spacing: -1px;
        }
        .landing-subtitle {
            font-size: 15px;
            margin-bottom: 28px;
        }
        .landing-container { 
            padding: 32px 20px; 
            width: 100%;
            border-radius: 28px;
        }
        .logo-wrapper {
            margin-bottom: 24px;
        }
        .brand-name {
            font-size: 22px;
        }
        .logo-icon {
            width: 32px;
            height: 32px;
        }
        .ai-badge {
            padding: 16px 20px;
            margin-bottom: 28px;
        }
        .ai-header {
            font-size: 11px;
        }
        .ai-desc {
            font-size: 13px;
        }
        .cta-button {
            padding: 16px 36px;
            font-size: 15px;
        }
        .privacy-pill {
            margin-top: 28px;
            padding: 8px 16px;
            font-size: 11px;
        }
        .landing-footer {
            margin-top: 28px;
            font-size: 10px;
        }
    }

    @media (max-width: 400px) {
        .landing-title {
            font-size: 32px;
        }
        .landing-container {
            padding: 24px 16px;
        }
    }
`;

// --- Main Component ---
export default function PDFExtractorApp() {
  // State Management
  const [appState, setAppState] = useState('LANDING');

  // Data State
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  // Categorized Results
  const [extractedPhotos, setExtractedPhotos] = useState([]);
  const [extractedIcons, setExtractedIcons] = useState([]);
  const [viewMode, setViewMode] = useState('photos');

  const [zipBlob, setZipBlob] = useState(null);
  const [errorDetails, setErrorDetails] = useState({ title: '', message: '' });

  // Settings
  const [useSmartExtraction, setUseSmartExtraction] = useState(true);

  // AI State
  const [apiKey, setApiKey] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [aiEnabled, setAiEnabled] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);
  const [showEstimateModal, setShowEstimateModal] = useState(false);

  // Summary State
  const [visualSummary, setVisualSummary] = useState("");
  const [isSummarizing, setIsSummarizing] = useState(false);

  // Validation & Quota State
  const [isValidating, setIsValidating] = useState(false);
  const [keyValidated, setKeyValidated] = useState(false);
  const [detectedTier, setDetectedTier] = useState('paid');
  const [usageStats, setUsageStats] = useState({
    requestsTotal: 0,
    tokensTotal: 0,
    rpmCount: 0,
    startTime: Date.now()
  });

  const processingRef = useRef(false);
  const landingContainerRef = useRef(null);

  // Parallax Effect for Landing Page
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!landingContainerRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      landingContainerRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    if (appState === 'LANDING') {
      document.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [appState]);

  // Load libraries on mount
  const [libsLoaded, setLibsLoaded] = useState(false);
  useEffect(() => {
    Promise.all([
      loadScript(LIBRARIES.pdfjs),
      loadScript(LIBRARIES.jszip),
      loadScript(LIBRARIES.fileSaver)
    ]).then(() => {
      if (window.pdfjsLib) {
        window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      }
      setLibsLoaded(true);
    }).catch(err => {
      console.error("Failed to load libraries", err);
      setErrorDetails({ title: 'System Error', message: 'Failed to load required libraries. Please check your internet connection.' });
      setAppState('ERROR');
    });
  }, []);

  // --- Helpers ---
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const validateApiKey = async (key) => {
    const cleanKey = key.trim();
    setIsValidating(true);
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: "ping" }] }]
        })
      });

      if (response.ok) {
        setKeyValidated(true);
        // Default to paid/optimistic, will downgrade on 429
        setDetectedTier('paid');
        return true;
      } else {
        const errorData = await response.json();

        if (response.status === 429) {
          console.warn("Key validated but quota exceeded (429). Downgrading to Free Tier.");
          setKeyValidated(true);
          setDetectedTier('free');
          alert("API Key Verified. \n\nâš ï¸ Note: Google indicates you are currently rate limited. We have automatically switched to 'Free Tier' mode (slower processing) to prevent errors.");
          return true;
        }

        console.error("Validation failed", errorData);
        alert(`Invalid API Key. Please check the key and try again.\n\nError: ${errorData.error?.message || 'Unknown error'}`);
        setKeyValidated(false);
        return false;
      }
    } catch (error) {
      console.error("Network error during validation", error);
      alert("Connection error. Unable to validate API key.");
      setKeyValidated(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleUnlockClick = async () => {
    if (!apiKey.trim()) return;
    await validateApiKey(apiKey.trim());
  };

  const handleRemoveKey = () => {
    setApiKey("");
    setKeyValidated(false);
    setDetectedTier('paid');
    setUsageStats({ requestsTotal: 0, tokensTotal: 0, rpmCount: 0, startTime: Date.now() });
    setAiEnabled(false);
    setVisualSummary("");
  };

  // Call Gemini Vision (Image Input)
  const callGeminiVision = async (base64Image, key) => {
    const cleanKey = key.trim();
    const prompt = `Task: Generate a High-Precision, RAG-Ready description for this image.
    
    Instructions:
    1. Analyze the image with extreme attention to detail (Thinking Mode: Enabled).
    2. Perform full OCR on any visible text.
    3. Describe visual structure, data relationships, specific colors, and emotional mood.
    4. Your output must be dense and information-rich to support vector embeddings for a text-based RAG system.
    
    Return a raw JSON object (no markdown) with:
    1. "filename": A short, descriptive filename (max 8 words, snake_case).
    2. "description": A comprehensive, very very very accurate paragraph combining visual analysis and text transcription.
    3. "tags": An array of 5-10 specific technical keywords for indexing.`;

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              { inlineData: { mimeType: "image/jpeg", data: base64Image } }
            ]
          }],
          generationConfig: {
            responseMimeType: "application/json"
          }
        })
      });

      if (!response.ok) {
        if (response.status === 429) throw new Error("RATE_LIMIT");
        throw new Error(`API Error: ${response.status}`);
      }
      const result = await response.json();

      const usage = result.usageMetadata || {};
      const totalTokens = (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0);

      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      return {
        data: JSON.parse(text),
        tokens: totalTokens
      };
    } catch (error) {
      if (error.message !== "RATE_LIMIT") {
        console.error("Gemini API Error:", error);
      }
      throw error;
    }
  };

  // Call Gemini Text (Text Input) - For Summarization
  const callGeminiText = async (prompt, key) => {
    const cleanKey = key.trim();
    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${cleanKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            responseMimeType: "text/plain"
          }
        })
      });

      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const result = await response.json();
      const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

      // Update stats for text call
      const usage = result.usageMetadata || {};
      const totalTokens = (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0);
      updateUsageStats(totalTokens);

      return text;
    } catch (error) {
      console.error("Gemini Text API Error:", error);
      return null;
    }
  };

  // --- Handlers ---

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    validateAndProcess(droppedFile);
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    validateAndProcess(selectedFile);
  };

  const validateAndProcess = (selectedFile) => {
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf') {
      alert("Please upload a valid PDF file.");
      return;
    }

    setFile(selectedFile);
  };

  const handleStartExtraction = () => {
    if (file) startProcessing(file);
  };

  const updateUsageStats = (tokens) => {
    setUsageStats(prev => ({
      ...prev,
      requestsTotal: prev.requestsTotal + 1,
      tokensTotal: prev.tokensTotal + tokens,
      rpmCount: prev.rpmCount + 1
    }));
  };

  const calculateEstimate = () => {
    const count = extractedPhotos.length;
    const estTokens = count * 600;
    const freeTimeSec = count * 4;
    const paidTimeSec = Math.ceil(count / 5) * 1.0;
    return { count, estTokens, freeTimeSec, paidTimeSec };
  };

  const initiateAiAnalysis = () => {
    if (!keyValidated) {
      if (!apiKey) {
        setShowKeyInput(true);
        return;
      }
      validateApiKey(apiKey.trim()).then(valid => {
        if (valid) setShowEstimateModal(true);
      });
    } else {
      setShowEstimateModal(true);
    }
  }

  const runAiAnalysis = async () => {
    setShowEstimateModal(false);
    setIsAnalyzing(true);
    setAnalysisProgress(0);

    const photosToAnalyze = [...extractedPhotos];

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
              const result = await callGeminiVision(base64, apiKey);
              if (result && result.data) {
                photosToAnalyze[index] = {
                  ...photo,
                  aiData: result.data,
                  fileName: `${result.data.filename}.jpg`
                };
                updateUsageStats(result.tokens);
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
          if (err.message !== "RATE_LIMIT") {
            console.warn(`Analysis failed for image ${index}`, err);
          }
        } finally {
          processedCount++;
          const totalProgress = Math.round(((extractedPhotos.length - totalToProcess + processedCount) / extractedPhotos.length) * 100);
          setAnalysisProgress(totalProgress);
        }
      }));

      if (rateLimitHitInBatch && currentTier === 'paid') {
        console.warn("Rate limit hit! Auto-downgrading to Free Tier limits.");
        setDetectedTier('free');
        currentTier = 'free';
        batchSize = 1;
        delayBetween = 4000;
      }

      i += batchSize;

      if (i < totalToProcess) {
        await new Promise(r => setTimeout(r, delayBetween));
      }
    }

    setExtractedPhotos(photosToAnalyze);
    setAiEnabled(true);
    setIsAnalyzing(false);
    regenerateZip(photosToAnalyze, extractedIcons);
  };

  const handleGenerateSummary = async () => {
    if (!aiEnabled || !apiKey) return;

    setIsSummarizing(true);

    // Collect descriptions
    const descriptions = extractedPhotos
      .filter(p => p.aiData)
      .map((p, i) => `Image ${i + 1}: ${p.aiData.description}`)
      .join("\n");

    if (!descriptions) {
      setIsSummarizing(false);
      return;
    }

    const prompt = `Here are visual descriptions of images extracted from a PDF document:\n\n${descriptions}\n\nBased ONLY on these images, write a concise "Visual Executive Summary" (max 3 sentences) describing what this document appears to be about (e.g., "A financial report with revenue charts", "A technical manual for a coffee machine", etc.).`;

    const summary = await callGeminiText(prompt, apiKey);
    if (summary) {
      setVisualSummary(summary);
    }
    setIsSummarizing(false);
  };

  const regenerateZip = async (photos, icons) => {
    const zip = new window.JSZip();
    const photosFolder = zip.folder("photos");
    const photosMetaFolder = zip.folder("photos_metadata");
    const iconsFolder = zip.folder("icons");
    const iconsMetaFolder = zip.folder("icons_metadata");

    photos.forEach(p => {
      photosFolder.file(p.fileName, p.blob);
      const metaData = {
        original_extraction_name: p.originalName || p.fileName,
        current_filename: p.fileName,
        source_page: p.source_page,
        width: p.w,
        height: p.h,
        ai_model: "Gemini 3 Pro (Thinking Mode Simulated)",
        ai_description_rag_ready: p.aiData?.description || "No description generated",
        ai_tags: p.aiData?.tags || [],
        ai_full_analysis: p.aiData || null
      };
      photosMetaFolder.file(p.fileName.replace('.jpg', '.json'), JSON.stringify(metaData, null, 2));
    });

    icons.forEach(i => {
      iconsFolder.file(i.fileName, i.blob);
      const metaData = {
        filename: i.fileName,
        source_page: i.source_page,
        width: i.w,
        height: i.h
      };
      iconsMetaFolder.file(i.fileName.replace(/\.(png|jpg)/, '.json'), JSON.stringify(metaData, null, 2));
    });

    const content = await zip.generateAsync({ type: "blob" });
    setZipBlob(content);
  };

  // --- CORE PROCESSING LOGIC ---
  const startProcessing = async (pdfFile) => {
    setAppState('PROCESSING');
    setProgress(0);
    setExtractedPhotos([]);
    setExtractedIcons([]);
    setStatusText('Initializing PDF Engine...');
    processingRef.current = true;
    setViewMode('photos');
    setAiEnabled(false);
    setVisualSummary("");

    try {
      if (!libsLoaded) throw new Error("Libraries not ready");

      const arrayBuffer = await pdfFile.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument(arrayBuffer).promise;
      const totalPages = pdf.numPages;

      const zip = new window.JSZip();
      const photosFolder = zip.folder("photos");
      const photosMetaFolder = zip.folder("photos_metadata");
      const iconsFolder = zip.folder("icons");
      const iconsMetaFolder = zip.folder("icons_metadata");

      let collectedPhotos = [];
      let collectedIcons = [];
      let pageCounts = { photos: {}, icons: {} };

      const isPhotoCheck = (w, h, size) => {
        if (w > 200 || h > 200) return true;
        if (size > 5000) return true;
        if (w >= 80 && h >= 80 && size > 500) return true;
        return false;
      };

      const saveImage = async (blob, ext, pageIdx, w, h, method) => {
        const isPhoto = isPhotoCheck(w, h, blob.size);
        const type = isPhoto ? 'photos' : 'icons';

        if (!pageCounts[type][pageIdx]) pageCounts[type][pageIdx] = 0;
        pageCounts[type][pageIdx]++;
        const count = pageCounts[type][pageIdx];

        const baseName = `Page ${pageIdx}-${count}`;
        const fileName = isPhoto ? `${baseName}.${ext}` : `Icon_${baseName}.${ext}`;
        const metaName = isPhoto ? `${baseName}.json` : `Icon_${baseName}.json`;

        const metaData = {
          original_filename: fileName,
          source_page: pageIdx,
          page_index: count,
          width_px: w,
          height_px: h,
          file_size_bytes: blob.size,
          category: type,
          extraction_method: method
        };

        if (isPhoto) {
          photosFolder.file(fileName, blob);
          photosMetaFolder.file(metaName, JSON.stringify(metaData, null, 2));
          collectedPhotos.push({ blob, fileName, w, h, source_page: pageIdx, originalName: fileName });
        } else {
          iconsFolder.file(fileName, blob);
          iconsMetaFolder.file(metaName, JSON.stringify(metaData, null, 2));
          collectedIcons.push({ blob, fileName, w, h, source_page: pageIdx });
        }
      };

      if (useSmartExtraction) {
        const OPS = window.pdfjsLib.OPS;
        const traverseOperators = async (ops, resources, pageIndex) => {
          for (let j = 0; j < ops.fnArray.length; j++) {
            if (!processingRef.current) return;
            const fn = ops.fnArray[j];
            const args = ops.argsArray[j];
            if (fn === OPS.paintJpegXObject) {
              const imgName = args[0];
              try {
                let imgInfo = null;
                try { imgInfo = await resources.get(imgName); } catch (e) { }
                if (imgInfo && imgInfo.data && imgInfo.data.length > 0) {
                  const blob = new Blob([imgInfo.data], { type: 'image/jpeg' });
                  if (blob.size > 100) await saveImage(blob, 'jpg', pageIndex, imgInfo.width, imgInfo.height, 'SmartScan_JPEG_Data');
                }
              } catch (e) { }
            }
            else if (fn === OPS.paintImageXObject || fn === OPS.paintInlineImageXObject) {
              let imgName, imgInfo;
              try {
                if (fn === OPS.paintInlineImageXObject) imgInfo = args[0];
                else { imgName = args[0]; try { imgInfo = await resources.get(imgName); } catch (e) { } }
                if (imgInfo) {
                  const width = imgInfo.width;
                  const height = imgInfo.height;
                  if (width < 5 || height < 5) continue;
                  const canvas = document.createElement('canvas');
                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  let drawn = false;
                  if (imgInfo.bitmap) { ctx.drawImage(imgInfo.bitmap, 0, 0, width, height); drawn = true; }
                  else if (imgInfo.data) {
                    try {
                      const imageData = new ImageData(new Uint8ClampedArray(imgInfo.data.buffer || imgInfo.data), width, height);
                      ctx.putImageData(imageData, 0, 0); drawn = true;
                    } catch (err) { }
                  }
                  if (drawn) {
                    const blob = await new Promise(r => canvas.toBlob(r, 'image/png'));
                    if (blob && blob.size > 100) await saveImage(blob, 'png', pageIndex, width, height, 'SmartScan_BitmapRender');
                  }
                  canvas.remove();
                }
              } catch (e) { }
            }
            else if (fn === OPS.paintFormXObject) {
              const formName = args[0];
              try {
                let form = null;
                try { form = await resources.get(formName); } catch (e) { }
                if (form && form.getOperatorList) {
                  const formOps = await form.getOperatorList();
                  await traverseOperators(formOps, form.objs || resources, pageIndex);
                }
              } catch (e) { }
            }
          }
        };
        for (let i = 1; i <= totalPages; i++) {
          if (!processingRef.current) break;
          setStatusText(`Deep scanning page ${i} of ${totalPages}...`);
          setProgress(Math.round(((i - 1) / totalPages) * 100));
          try {
            const page = await pdf.getPage(i);
            const ops = await page.getOperatorList();
            await traverseOperators(ops, page.objs, i);
            page.cleanup();
          } catch (e) { }
        }
      } else {
        for (let i = 1; i <= totalPages; i++) {
          if (!processingRef.current) break;
          setStatusText(`Converting page ${i} of ${totalPages} to image...`);
          setProgress(Math.round(((i - 1) / totalPages) * 100));
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 2.0 });
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          canvas.width = viewport.width;
          canvas.height = viewport.height;
          await page.render({ canvasContext: ctx, viewport }).promise;
          const blob = await new Promise(r => canvas.toBlob(r, 'image/jpeg', 0.9));
          if (blob) await saveImage(blob, 'jpg', i, canvas.width, canvas.height, 'Full_Page_Render');
          page.cleanup();
          canvas.remove();
        }
      }

      if (collectedPhotos.length === 0 && collectedIcons.length === 0) throw new Error("NO_IMAGES");

      setProgress(100);
      setStatusText('Packaging Categorized ZIP...');
      const content = await zip.generateAsync({ type: "blob" });
      setZipBlob(content);
      setExtractedPhotos(collectedPhotos.map(img => ({ ...img, url: URL.createObjectURL(img.blob) })));
      setExtractedIcons(collectedIcons.map(img => ({ ...img, url: URL.createObjectURL(img.blob) })));
      if (collectedPhotos.length > 0) setViewMode('photos'); else setViewMode('icons');
      setAppState('RESULTS');

    } catch (error) {
      console.error(error);
      if (error.message === "NO_IMAGES") {
        if (useSmartExtraction) setErrorDetails({ title: "Deep Scan Found 0 Images", message: "We checked all layers but found no images. Try 'Convert Pages to Images' mode." });
        else setErrorDetails({ title: "Extraction Failed", message: "Could not convert pages to images. The file might be corrupted." });
      } else if (error.name === "PasswordException") setErrorDetails({ title: "Encrypted PDF", message: "This PDF is password protected. Please unlock it and try again." });
      else setErrorDetails({ title: "Processing Error", message: "An unexpected error occurred. Please try a different file." });
      setAppState('ERROR');
    }
  };

  const handleDownload = () => {
    if (zipBlob) {
      const timestamp = new Date().getTime();
      const filename = `WiseExtract-${aiEnabled ? 'RAG-Ready-' : ''}${timestamp}.zip`;

      // Use native download approach for reliable filename setting
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleBack = () => {
    if (appState === 'RESULTS' || appState === 'ERROR') {
      handleReset(); // Go back to UPLOAD/LANDING cleanly
    } else if (appState === 'UPLOAD') {
      setAppState('LANDING');
    }
  };

  const handleReset = () => {
    setAppState('UPLOAD');
    setFile(null);
    setExtractedPhotos([]);
    setExtractedIcons([]);
    setZipBlob(null);
    setProgress(0);
    setAiEnabled(false);
    setShowKeyInput(false);
    setKeyValidated(false);
    setUsageStats({ requestsTotal: 0, tokensTotal: 0, rpmCount: 0, startTime: Date.now() });
    setVisualSummary("");
  };

  // --- SUBCOMPONENTS ---

  const EstimateModal = () => {
    const { count, estTokens, freeTimeSec, paidTimeSec } = calculateEstimate();
    const isPaidMode = detectedTier === 'paid';

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white">
            <div className="flex items-center gap-2 mb-2">
              <BrainCircuit className="w-6 h-6" />
              <h3 className="text-xl font-bold">RAG Data Generation</h3>
            </div>
            <p className="text-purple-100 text-sm">
              Ready to analyze {count} images using your Gemini API key.
            </p>
          </div>

          <div className="p-6">
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Photos to Analyze</span>
                <span className="font-bold text-slate-800">{count}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-500">Est. Token Usage</span>
                <span className="font-bold text-slate-800">~{estTokens.toLocaleString()}</span>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-semibold text-slate-700">Detected Capability</span>
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${isPaidMode ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                    {isPaidMode ? 'PAID / HIGH LIMIT' : 'FREE / LOW LIMIT'}
                  </span>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed mb-3">
                  {isPaidMode
                    ? "We've detected a high-capacity key. Analysis will run in parallel batches for maximum speed. If rate limits are hit, we will auto-downgrade."
                    : "We detected rate limits on this key (429 Error). Analysis will run in 'Eco Mode' (1 request at a time) to prevent errors."}
                </p>

                <div className="mt-2 text-center pt-2 border-t border-slate-200">
                  <span className="text-xs text-slate-500">
                    Estimated Time: <span className="font-bold text-slate-800">~{isPaidMode ? paidTimeSec : freeTimeSec} seconds</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowEstimateModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={runAiAnalysis}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all flex justify-center items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                Start Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const UsageDashboard = () => {
    const isPaid = detectedTier === 'paid';
    const limitRPM = isPaid ? 2000 : 15;
    const limitTPM = isPaid ? 4000000 : 1000000;

    const rpmPercent = Math.min((usageStats.rpmCount / limitRPM) * 100, 100);
    const tpmPercent = Math.min((usageStats.tokensTotal / limitTPM) * 100, 100);

    return (
      <div className="mt-4 bg-white/5 text-white rounded-xl p-3 sm:p-4 shadow-xl border border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59, 130, 246, .2) 25%, rgba(59, 130, 246, .2) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .2) 75%, rgba(59, 130, 246, .2) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59, 130, 246, .2) 25%, rgba(59, 130, 246, .2) 26%, transparent 27%, transparent 74%, rgba(59, 130, 246, .2) 75%, rgba(59, 130, 246, .2) 76%, transparent 77%, transparent)', backgroundSize: '20px 20px' }}></div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 relative z-10 gap-2 sm:gap-4">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" />
            <span className="font-bold text-sm sm:text-base tracking-wide text-white">AI DASHBOARD</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="px-2 sm:px-3 py-1 bg-white/10 rounded-full border border-white/20 text-[10px] sm:text-xs font-mono text-blue-300 flex items-center gap-1 sm:gap-2">
              <div className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${isPaid ? 'bg-purple-400' : 'bg-green-400'} animate-pulse`}></div>
              <span className="whitespace-nowrap">{isPaid ? 'PAID TIER' : 'FREE TIER'}</span>
            </div>
            <button
              onClick={handleRemoveKey}
              className="p-1.5 sm:p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20"
              title="Remove Key"
            >
              <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 relative z-10">
          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">REQUESTS</span>
              <span className="text-base sm:text-lg font-bold font-mono text-white">{usageStats.rpmCount}</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 sm:h-2 rounded-full overflow-hidden">
              <div className={`h-full transition-all duration-500 ${rpmPercent > 90 ? 'bg-red-400' : 'bg-green-400'}`} style={{ width: `${rpmPercent}%` }}></div>
            </div>
            <div className="flex justify-between mt-1 text-[9px] sm:text-[10px] text-slate-500 font-mono">
              <span>0</span>
              <span>/{limitRPM} RPM</span>
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg border border-white/10">
            <div className="flex justify-between items-end mb-2">
              <span className="text-[10px] sm:text-xs text-slate-400 font-mono">TOKENS</span>
              <span className="text-base sm:text-lg font-bold font-mono text-white">{(usageStats.tokensTotal / 1000).toFixed(1)}k</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 sm:h-2 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 transition-all duration-500" style={{ width: `${Math.min((usageStats.tokensTotal / 100000) * 100, 100)}%` }}></div>
            </div>
            <div className="mt-1 text-[9px] sm:text-[10px] text-slate-500 font-mono text-right">
              ~$0.00 (Flash)
            </div>
          </div>

          <div className="bg-white/5 p-3 rounded-lg border border-white/10 flex items-center">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className={`p-2 sm:p-2.5 rounded-full ${isPaid ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'}`}>
                <Zap className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <div>
                <div className="text-[10px] sm:text-xs text-slate-400 font-mono">SPEED</div>
                <div className="text-xs sm:text-sm font-bold text-white">
                  {isPaid ? 'TURBO' : 'ECO'}
                </div>
                <div className="text-[9px] sm:text-[10px] text-slate-500">
                  {isPaid ? 'Parallel ON' : 'Rate Limited'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const RateLimitInfoPanel = ({ tier }) => (
    <div className="mt-4 p-3 sm:p-4 bg-blue-500/10 rounded-xl border border-blue-500/20 text-sm animate-in fade-in slide-in-from-top-2">
      <div className="flex items-center gap-2 mb-2 sm:mb-3">
        <Info className="w-4 h-4 text-blue-400" />
        <h4 className="font-semibold text-blue-300 text-xs sm:text-sm">
          {tier === 'paid' ? 'High Performance Tier Active' : 'Standard/Free Tier Active'}
        </h4>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div>
          <span className="block text-[9px] sm:text-[10px] text-blue-400 uppercase font-bold tracking-wider">Requests / Min</span>
          <span className="text-sm sm:text-base font-mono text-blue-200 font-medium">{tier === 'paid' ? '2,000' : '15'} RPM</span>
        </div>
        <div>
          <span className="block text-[9px] sm:text-[10px] text-blue-400 uppercase font-bold tracking-wider">Tokens / Min</span>
          <span className="text-sm sm:text-base font-mono text-blue-200 font-medium">{tier === 'paid' ? '4M' : '1M'} TPM</span>
        </div>
        {tier === 'free' && (
          <div className="col-span-2 border-t border-blue-500/20 pt-2 mt-1">
            <span className="block text-[9px] sm:text-[10px] text-blue-400 uppercase font-bold tracking-wider">Requests / Day</span>
            <span className="text-sm sm:text-base font-mono text-blue-200 font-medium">1,500 RPD</span>
          </div>
        )}
      </div>
    </div>
  );

  // --- Render Views ---

  // 1. Landing Page
  if (appState === 'LANDING') {
    return (
      <>
        <style>{LANDING_STYLES}</style>
        <div className="snow-background">
          <PixelSnow
            color="#ffffff"
            flakeSize={0.01}
            minFlakeSize={1.25}
            pixelResolution={200}
            speed={1.25}
            density={0.3}
            direction={125}
            brightness={1}
          />
        </div>

        <main className="landing-root">
          <div className="landing-container" ref={landingContainerRef}>
            <div className="logo-wrapper">
              <div className="logo-icon"></div>
              <span className="brand-name">WiseExtract</span>
            </div>

            <h1 className="landing-title">Extract Photos<br />from PDFs</h1>

            <p className="landing-subtitle">Intelligent separation of imagery and iconography.</p>

            <div className="ai-badge">
              <div className="ai-header">
                <Sparkles width="18" height="18" style={{ marginRight: '8px' }} />
                High-Precision AI
              </div>
              <p className="ai-desc">Thinking Mode Analysis with 32k token budget for RAG-Ready context descriptions.</p>
            </div>

            <div>
              <button className="cta-button" onClick={() => setAppState('UPLOAD')}>
                Get Started
                <ArrowRight width="20" height="20" />
              </button>
            </div>

            <div className="privacy-pill">
              <ShieldCheck width="14" height="14" />
              Privacy First: Files never leave your local environment.
            </div>

            <div className="landing-footer">
              WiseExtract &bull; Developed by <a href="https://magdysaber.com" target="_blank" rel="noopener noreferrer">Magdy Saber</a>
            </div>
          </div>
        </main>
      </>
    );
  }

  // Common Layout with Dark Theme and PixelSnow
  const Wrapper = ({ children, wide = false }) => (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-3 sm:p-4 md:p-8 font-sans relative overflow-hidden">
      {/* PixelSnow Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <PixelSnow
          color="#ffffff"
          flakeSize={0.01}
          minFlakeSize={1.25}
          pixelResolution={200}
          speed={1.25}
          density={0.25}
          direction={125}
          brightness={0.8}
        />
      </div>

      <div className={`${wide ? 'max-w-6xl' : 'max-w-2xl'} w-full bg-[#0a0f1e]/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col transition-all duration-500 border border-white/10 z-10`}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-black/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center space-x-2 text-white">
            {appState !== 'LANDING' && (
              <button
                onClick={handleBack}
                className="p-1 rounded-full hover:bg-white/10 mr-2 transition-colors"
                title="Back"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-blue-400" />
            <span className="font-bold text-base sm:text-lg">WiseExtract</span>
          </div>
          {appState !== 'LANDING' && appState !== 'UPLOAD' && (
            <div className="flex gap-2 flex-wrap justify-end">
              <div className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 bg-white/10 rounded-full text-slate-300 flex items-center gap-1">
                {useSmartExtraction ? 'Smart Scan' : 'Page Capture'}
              </div>
              {aiEnabled && (
                <div className="text-[10px] sm:text-xs font-medium px-2 sm:px-3 py-1 bg-purple-500/20 rounded-full text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> RAG Enhanced
                </div>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 p-4 sm:p-6 md:p-10 flex flex-col justify-center overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        <div className="p-3 sm:p-4 bg-black/30 text-center text-[10px] sm:text-xs text-slate-500 border-t border-white/10">
          WiseExtract • Privacy Focused • Developed by <a href="https://magdysaber.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-400 font-semibold transition-colors">Magdy Saber</a>
        </div>
      </div>
    </div>
  );

  // 2. Upload Page
  if (appState === 'UPLOAD') {
    return (
      <Wrapper>
        <div className="text-center mb-4 sm:mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-white">Upload your PDF</h2>
          <p className="text-slate-400 mt-1 text-sm sm:text-base">Select an extraction mode below.</p>
        </div>

        {/* Mode Toggles */}
        <div className="flex flex-col sm:flex-row justify-center mb-6 sm:mb-8 bg-white/5 p-1 rounded-lg w-full sm:w-fit mx-auto gap-1">
          <button
            onClick={() => setUseSmartExtraction(true)}
            className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${useSmartExtraction ? 'bg-white/10 text-blue-400 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Camera className="w-4 h-4" />
            <span>Smart Extract (Photos + Icons)</span>
          </button>
          <button
            onClick={() => setUseSmartExtraction(false)}
            className={`flex items-center justify-center space-x-2 px-3 sm:px-4 py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${!useSmartExtraction ? 'bg-white/10 text-blue-400 shadow-sm border border-blue-500/30' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <FileText className="w-4 h-4" />
            <span>Convert Pages to Images</span>
          </button>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="group relative flex flex-col items-center justify-center w-full h-48 sm:h-56 border-2 border-dashed rounded-2xl transition-all duration-300 bg-white/5 border-white/20 hover:border-blue-400 hover:bg-blue-500/10"
        >
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/10 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10">
              <Upload className="w-6 h-6 sm:w-8 sm:h-8 text-slate-400 group-hover:text-blue-400" />
            </div>
          </div>
          <input
            type="file"
            accept=".pdf"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <div className="mt-20 sm:mt-24 pointer-events-none">
            <span className="px-5 sm:px-6 py-2 bg-white/10 border border-white/20 shadow-sm rounded-full text-xs sm:text-sm font-medium text-slate-300 group-hover:border-blue-400/50 group-hover:text-blue-400">
              Choose File
            </span>
          </div>
        </div>

        {file && (
          <div className="mb-6 sm:mb-8 w-full max-w-md mx-auto mt-4">
            <div className="bg-white/5 border border-white/10 rounded-xl p-3 sm:p-4 flex items-center gap-3 sm:gap-4 shadow-sm mb-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{file.name}</p>
                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="p-2 text-slate-400 hover:text-red-400 hover:bg-white/5 rounded-full transition-colors"
                title="Change File"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleStartExtraction}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              Start Extraction
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* API Key Input (Bottom of Upload Page) */}
        <div className="mt-8 sm:mt-12 max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key className={`h-4 w-4 ${keyValidated ? "text-green-400" : "text-slate-500"}`} />
              </div>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setKeyValidated(false); }}
                className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white/5 text-white placeholder-slate-500 ${keyValidated ? "border-green-500/30 bg-green-500/10 focus:ring-green-500" : "border-white/10 focus:ring-purple-500"}`}
                placeholder="Enter Gemini API Key (Optional for AI)"
                disabled={keyValidated}
              />
            </div>
            <button
              onClick={keyValidated ? handleRemoveKey : handleUnlockClick}
              disabled={!apiKey && !keyValidated || isValidating}
              className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm ${keyValidated ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30" : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"}`}
            >
              {isValidating ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : keyValidated ? (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Remove</span>
                </>
              ) : (
                <>
                  <Unlock className="w-4 h-4" />
                  <span>Unlock AI</span>
                </>
              )}
            </button>
          </div>

          {/* Info Panels */}
          {keyValidated && <RateLimitInfoPanel tier={detectedTier} />}
          {keyValidated && <UsageDashboard />}

          {!keyValidated && (
            <p className="text-[10px] text-slate-500 mt-3 text-center">
              Enter your key to enable High-Precision RAG analysis. <br />
              <span className="font-semibold text-slate-400">Your key and data remain exclusively on your device.</span>
            </p>
          )}
        </div>
      </Wrapper>
    );
  }

  // 3. Processing Page
  if (appState === 'PROCESSING') {
    return (
      <Wrapper>
        <div className="text-center w-full max-w-md mx-auto">
          <div className="mb-6 sm:mb-8 relative">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
              <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 animate-spin" />
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-full animate-ping opacity-20 -z-10"></div>
          </div>

          <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
            {statusText}
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8">
            Separating photos, icons, and metadata...
          </p>

          <div className="w-full bg-white/10 rounded-full h-2.5 sm:h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-slate-500 font-medium">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
        </div>
      </Wrapper>
    );
  }

  // 4. Results Page
  if (appState === 'RESULTS') {
    return (
      <Wrapper wide={true}>
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 sm:mb-8 gap-4">
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2">
              <h2 className="text-xl sm:text-2xl font-bold text-white">Extraction Complete</h2>
              <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-400" />
            </div>
            <p className="text-slate-400 text-sm sm:text-base">
              Found {extractedPhotos.length} Photos and {extractedIcons.length} Icons.
            </p>
          </div>

          {/* Action Bar */}
          <div className="flex flex-wrap justify-center gap-2">
            {/* Visual Summary Button */}
            {extractedPhotos.some(p => p.aiData) && !isSummarizing && !visualSummary && (
              <button
                onClick={handleGenerateSummary}
                className="px-3 sm:px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2"
              >
                <FileJson className="w-4 h-4" />
                <span className="hidden sm:inline">Generate Executive Summary</span>
                <span className="sm:hidden">Summary</span>
              </button>
            )}

            {/* AI Analyze Button - Only show if photos exist and we're not already done */}
            {extractedPhotos.length > 0 && !aiEnabled && !isAnalyzing && (
              <button
                onClick={initiateAiAnalysis}
                className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2 hover:-translate-y-0.5"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">Generate RAG Data</span>
                <span className="sm:hidden">RAG Data</span>
              </button>
            )}
            {isAnalyzing && (
              <div className="px-3 sm:px-4 py-2 bg-purple-500/20 text-purple-300 border border-purple-500/30 rounded-lg text-xs sm:text-sm font-medium flex items-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Generating RAG Data {analysisProgress}%</span>
              </div>
            )}
          </div>
        </div>

        {/* --- VISUAL SUMMARY CARD --- */}
        {visualSummary && (
          <div className="mb-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 sm:p-5 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2 mb-2 text-indigo-300">
              <Sparkles className="w-5 h-5" />
              <h3 className="font-bold text-sm sm:text-base">Document Visual Executive Summary</h3>
            </div>
            <p className="text-indigo-200 text-xs sm:text-sm leading-relaxed">
              {visualSummary}
            </p>
          </div>
        )}
        {isSummarizing && (
          <div className="mb-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl p-4 sm:p-5 flex items-center justify-center gap-3">
            <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
            <span className="text-indigo-300 font-medium text-sm">Synthesizing visual summary...</span>
          </div>
        )}

        {/* --- USAGE DASHBOARD (Only shows if key is validated) --- */}
        {keyValidated && <UsageDashboard />}
        {keyValidated && <RateLimitInfoPanel tier={detectedTier} />}

        {/* --- ESTIMATE MODAL --- */}
        {showEstimateModal && <EstimateModal />}

        {/* API Key Banner Alert (If NOT validated/entered yet) */}
        {!keyValidated && showKeyInput && !aiEnabled && (
          <div className="mb-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 sm:p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/20 rounded-full border border-purple-500/30">
                <Database className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h4 className="font-semibold text-purple-200 text-sm sm:text-base">Enter API Key for RAG Processing</h4>
                <p className="text-[10px] sm:text-xs text-purple-300">
                  A Gemini API key is required to generate high-precision descriptions. <br className="hidden sm:block" />
                  <span className="font-bold">Your key is used only locally.</span>
                </p>
              </div>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="password"
                placeholder="Paste Gemini API Key"
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setKeyValidated(false); }}
                className="flex-1 md:w-48 lg:w-64 px-3 py-2 rounded-lg border border-purple-500/30 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
              />
              <button
                onClick={handleUnlockClick}
                disabled={!apiKey || isValidating}
                className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock"}
              </button>
            </div>
          </div>
        )}

        {/* Category Tabs */}
        <div className="flex justify-start space-x-2 sm:space-x-4 mb-4 sm:mb-6 border-b border-white/10 pb-1 overflow-x-auto">
          <button
            onClick={() => setViewMode('photos')}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${viewMode === 'photos' ? 'border-blue-400 text-blue-400 bg-blue-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <ImageIcon className="w-4 h-4" />
            <span>Photos ({extractedPhotos.length})</span>
          </button>
          <button
            onClick={() => setViewMode('icons')}
            className={`flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${viewMode === 'icons' ? 'border-blue-400 text-blue-400 bg-blue-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
          >
            <Layers className="w-4 h-4" />
            <span>Icons ({extractedIcons.length})</span>
          </button>
        </div>

        {/* Scrollable Gallery */}
        <div className="flex-1 min-h-[250px] sm:min-h-[300px] max-h-[400px] sm:max-h-[500px] overflow-y-auto p-3 sm:p-6 bg-white/5 rounded-xl border border-white/10 mb-4 sm:mb-6 custom-scrollbar">
          {((viewMode === 'photos' ? extractedPhotos : extractedIcons).length === 0) ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <ImageIcon className="w-10 h-10 sm:w-12 sm:h-12 mb-2 opacity-50" />
              <p className="text-sm">No {viewMode} found in this PDF.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-6">
              {(viewMode === 'photos' ? extractedPhotos : extractedIcons).map((img, idx) => (
                <div key={idx} className="group relative flex flex-col bg-white/5 rounded-xl overflow-hidden shadow-sm border border-white/10 hover:shadow-lg hover:border-blue-500/30 transition-all hover:-translate-y-1">
                  <div className="aspect-square bg-black/20 relative overflow-hidden">
                    <img src={img.url} alt={`Extracted ${idx}`} className="w-full h-full object-contain p-2" />
                    {/* Overlay for AI Tags */}
                    {img.aiData && (
                      <div className="absolute top-1 sm:top-2 right-1 sm:right-2 flex flex-col items-end space-y-1">
                        {img.aiData.tags.slice(0, 2).map((tag, tIdx) => (
                          <span key={tIdx} className="px-1.5 sm:px-2 py-0.5 bg-black/60 backdrop-blur-sm text-white text-[8px] sm:text-[10px] rounded-full font-medium shadow-sm">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="p-2 sm:p-3 bg-white/5 border-t border-white/5">
                    <p className="text-[10px] sm:text-xs font-semibold text-slate-300 truncate" title={img.fileName}>
                      {img.fileName}
                    </p>
                    {/* Added RAG Description Preview */}
                    {img.aiData?.description && (
                      <p className="text-[9px] sm:text-[10px] text-slate-500 mt-1 line-clamp-2 sm:line-clamp-3 leading-tight" title={img.aiData.description}>
                        {img.aiData.description}
                      </p>
                    )}
                    <p className="text-[9px] sm:text-[10px] text-slate-600 mt-1 sm:mt-2 flex justify-between">
                      <span>{img.w}x{img.h}</span>
                      <span>Page {img.source_page}</span>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <button
            onClick={handleDownload}
            className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl font-bold text-sm sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2"
          >
            <Download className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Download ZIP {aiEnabled ? '(RAG Ready)' : ''}</span>
          </button>

          <button
            onClick={handleReset}
            className="flex-1 py-2.5 sm:py-3 text-slate-400 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-colors flex items-center justify-center space-x-2 border border-white/10 hover:border-white/20 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Start Over</span>
          </button>
        </div>
      </Wrapper>
    );
  }

  // 5. Error Page
  if (appState === 'ERROR') {
    return (
      <Wrapper>
        <div className="text-center py-6 sm:py-8">
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-red-500/20 rounded-full mb-4 sm:mb-6 border border-red-500/30">
            <AlertTriangle className="w-8 h-8 sm:w-10 sm:h-10 text-red-400" />
          </div>

          <h2 className="text-lg sm:text-xl font-bold text-white mb-2">{errorDetails.title}</h2>
          <p className="text-slate-400 max-w-xs mx-auto mb-6 sm:mb-8 text-sm">
            {errorDetails.message}
          </p>

          <div className="flex flex-col space-y-3">
            {useSmartExtraction && errorDetails.title.includes("0 Images") && (
              <button
                onClick={() => {
                  setUseSmartExtraction(false);
                  setAppState('UPLOAD');
                }}
                className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transition-colors shadow-lg text-sm sm:text-base"
              >
                Try "Page to Image" Mode Instead
              </button>
            )}
            <button
              onClick={handleReset}
              className="px-6 sm:px-8 py-3 bg-white/10 text-slate-300 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10 text-sm sm:text-base"
            >
              Try Another File
            </button>
          </div>
        </div>
      </Wrapper>
    );
  }

  return null;
}
