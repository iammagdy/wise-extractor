import React, { useState } from 'react';
import AppWrapper from '../layout/AppWrapper';
import {
    CheckCircle, Sparkles, FileJson, Loader2, Database, Layers, ImageIcon, Download, RefreshCw,
    BrainCircuit, Activity, Trash2, Zap, Info
} from 'lucide-react';
import useAppStore from '../../store/useAppStore';
import { downloadBlob } from '../../services/file-utils';

const EstimateModal = ({ onClose, onConfirm }) => {
    const { extractedPhotos, detectedTier } = useAppStore();
    const count = extractedPhotos.length;
    const estTokens = count * 600;
    const freeTimeSec = count * 4;
    const paidTimeSec = Math.ceil(count / 5) * 1.0;
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

          <div className="p-6 text-left">
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
                onClick={onClose}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-lg hover:shadow-purple-500/30 transition-all flex justify-center items-center gap-2 cursor-pointer"
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

const UsageDashboard = ({ usageStats, tier, removeApiKey }) => {
    const isPaid = tier === 'paid';
    const limitRPM = isPaid ? 2000 : 15;
    const rpmPercent = Math.min((usageStats.rpmCount / limitRPM) * 100, 100);

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
              onClick={removeApiKey}
              className="p-1.5 sm:p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors border border-red-500/20 cursor-pointer"
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

export default function ResultsGallery() {
  const {
    extractedPhotos,
    extractedIcons,
    zipBlob,
    aiEnabled,
    isAnalyzing,
    analysisProgress,
    visualSummary,
    isSummarizing,
    keyValidated,
    detectedTier,
    usageStats,
    removeApiKey,
    apiKey,
    setApiKey,
    checkApiKey,
    isValidatingKey,
    runAiAnalysis,
    runSummaryGeneration,
    resetState
  } = useAppStore();

  const [viewMode, setViewMode] = useState(extractedPhotos.length > 0 ? 'photos' : 'icons');
  const [showEstimateModal, setShowEstimateModal] = useState(false);
  const [showKeyInput, setShowKeyInput] = useState(false);

  const handleDownload = () => {
    if (zipBlob) {
      const timestamp = new Date().getTime();
      const filename = `WiseExtract-${aiEnabled ? 'RAG-Ready-' : ''}${timestamp}.zip`;
      downloadBlob(zipBlob, filename);
    }
  };

  const initiateAiAnalysis = () => {
    if (!keyValidated) {
      if (!apiKey) {
        setShowKeyInput(true);
        return;
      }
      checkApiKey().then(() => {
        // Since checkApiKey updates state, we rely on the component re-render or explicit logic
        // But Zustand actions are async, we can't easily wait for state update inside action return unless we restructure.
        // For now, if user clicks again or if we move check logic outside store action to component:
        // Actually checkApiKey sets keyValidated. We can just show modal if valid.
        // But checkApiKey is async void.
        // Let's just set showKeyInput if not validated, user validates there.
      });
    } else {
      setShowEstimateModal(true);
    }
  };

  // If key becomes validated while waiting for input, user can proceed.

  const handleConfirmAnalysis = () => {
      setShowEstimateModal(false);
      runAiAnalysis();
  };

  return (
    <AppWrapper wide={true}>
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
              onClick={runSummaryGeneration}
              className="px-3 sm:px-4 py-2 bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
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
              className="px-3 sm:px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium shadow-md hover:shadow-lg transition-all flex items-center space-x-2 hover:-translate-y-0.5 cursor-pointer"
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
      {keyValidated && <UsageDashboard usageStats={usageStats} tier={detectedTier} removeApiKey={removeApiKey} />}
      {keyValidated && <RateLimitInfoPanel tier={detectedTier} />}

      {/* --- ESTIMATE MODAL --- */}
      {showEstimateModal && <EstimateModal onClose={() => setShowEstimateModal(false)} onConfirm={handleConfirmAnalysis} />}

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
              onChange={(e) => setApiKey(e.target.value)}
              className="flex-1 md:w-48 lg:w-64 px-3 py-2 rounded-lg border border-purple-500/30 bg-white/5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder-slate-500"
            />
            <button
              onClick={async () => {
                  await checkApiKey();
                  // Check if validation succeeded by reading store or assume user sees alert
                  const store = useAppStore.getState();
                  if (store.keyValidated) {
                      setShowEstimateModal(true);
                  }
              }}
              disabled={!apiKey || isValidatingKey}
              className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {isValidatingKey ? <Loader2 className="w-4 h-4 animate-spin" /> : "Unlock"}
            </button>
          </div>
        </div>
      )}

      {/* Category Tabs */}
      <div className="flex justify-start space-x-2 sm:space-x-4 mb-4 sm:mb-6 border-b border-white/10 pb-1 overflow-x-auto">
        <button
          onClick={() => setViewMode('photos')}
          className={`flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${viewMode === 'photos' ? 'border-blue-400 text-blue-400 bg-blue-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>Photos ({extractedPhotos.length})</span>
        </button>
        <button
          onClick={() => setViewMode('icons')}
          className={`flex items-center space-x-2 px-4 sm:px-6 py-2 rounded-t-lg text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap cursor-pointer ${viewMode === 'icons' ? 'border-blue-400 text-blue-400 bg-blue-500/10' : 'border-transparent text-slate-500 hover:text-slate-300'}`}
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
          className="flex-1 py-3 sm:py-4 bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white rounded-xl font-bold text-sm sm:text-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 cursor-pointer"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Download ZIP {aiEnabled ? '(RAG Ready)' : ''}</span>
        </button>

        <button
          onClick={resetState}
          className="flex-1 py-2.5 sm:py-3 text-slate-400 hover:text-white font-medium hover:bg-white/5 rounded-xl transition-colors flex items-center justify-center space-x-2 border border-white/10 hover:border-white/20 text-sm cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Start Over</span>
        </button>
      </div>
    </AppWrapper>
  );
}
