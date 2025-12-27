import React from 'react';
import AppWrapper from '../layout/AppWrapper';
import { Upload, Camera, FileText, Trash2, ArrowRight, Key, Unlock, Loader2, Activity, Zap, Info } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

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
    const limitTPM = isPaid ? 4000000 : 1000000;

    const rpmPercent = Math.min((usageStats.rpmCount / limitRPM) * 100, 100);
    // const tpmPercent = Math.min((usageStats.tokensTotal / limitTPM) * 100, 100); // Unused for now

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

export default function UploadPage() {
  const {
    file,
    setFile,
    useSmartExtraction,
    setUseSmartExtraction,
    startExtraction,
    apiKey,
    setApiKey,
    checkApiKey,
    keyValidated,
    isValidatingKey,
    detectedTier,
    usageStats,
    removeApiKey
  } = useAppStore();

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === 'application/pdf') {
      setFile(droppedFile);
    } else {
        alert("Please upload a valid PDF file.");
    }
  };

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile?.type === 'application/pdf') {
      setFile(selectedFile);
    } else if (selectedFile) {
        alert("Please upload a valid PDF file.");
    }
  };

  return (
    <AppWrapper>
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
            onClick={startExtraction}
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-600 text-white font-bold rounded-xl shadow-lg hover:shadow-blue-500/30 transition-all flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
          >
            Start Extraction
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* API Key Input */}
      <div className="mt-8 sm:mt-12 max-w-md mx-auto">
        <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Key className={`h-4 w-4 ${keyValidated ? "text-green-400" : "text-slate-500"}`} />
            </div>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className={`block w-full pl-10 pr-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all bg-white/5 text-white placeholder-slate-500 ${keyValidated ? "border-green-500/30 bg-green-500/10 focus:ring-green-500" : "border-white/10 focus:ring-purple-500"}`}
              placeholder="Enter Gemini API Key (Optional for AI)"
              disabled={keyValidated}
            />
          </div>
          <button
            onClick={keyValidated ? removeApiKey : checkApiKey}
            disabled={(!apiKey && !keyValidated) || isValidatingKey}
            className={`px-4 py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-sm cursor-pointer ${keyValidated ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 border border-red-500/30" : "bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-500 hover:to-blue-500"}`}
          >
            {isValidatingKey ? (
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
        {keyValidated && <UsageDashboard usageStats={usageStats} tier={detectedTier} removeApiKey={removeApiKey} />}

        {!keyValidated && (
          <p className="text-[10px] text-slate-500 mt-3 text-center">
            Enter your key to enable High-Precision RAG analysis. <br />
            <span className="font-semibold text-slate-400">Your key and data remain exclusively on your device.</span>
          </p>
        )}
      </div>
    </AppWrapper>
  );
}
