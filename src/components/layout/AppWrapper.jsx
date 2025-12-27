import React from 'react';
import PixelSnow from '../common/PixelSnow';
import { ChevronLeft, BrainCircuit, Sparkles } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function AppWrapper({ children, wide = false }) {
  const { appState, useSmartExtraction, aiEnabled, resetState } = useAppStore();

  const handleBack = () => {
    if (appState === 'RESULTS' || appState === 'ERROR') {
      resetState();
    } else if (appState === 'UPLOAD') {
      useAppStore.setState({ appState: 'LANDING' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-3 sm:p-4 md:p-8 font-sans relative overflow-hidden text-white">
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
                className="p-1 rounded-full hover:bg-white/10 mr-2 transition-colors cursor-pointer"
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
}
