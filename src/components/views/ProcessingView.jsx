import React from 'react';
import AppWrapper from '../layout/AppWrapper';
import { Loader2 } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function ProcessingView() {
  const { processingProgress, processingStatusText } = useAppStore();

  return (
    <AppWrapper>
      <div className="text-center w-full max-w-md mx-auto">
        <div className="mb-6 sm:mb-8 relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-500/30">
            <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 text-blue-400 animate-spin" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 bg-blue-400 rounded-full animate-ping opacity-20 -z-10"></div>
        </div>

        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
          {processingStatusText}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mb-6 sm:mb-8">
          Separating photos, icons, and metadata...
        </p>

        <div className="w-full bg-white/10 rounded-full h-2.5 sm:h-3 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full transition-all duration-300 ease-out"
            style={{ width: `${processingProgress}%` }}
          />
        </div>
        <div className="flex justify-between mt-2 text-[10px] sm:text-xs text-slate-500 font-medium">
          <span>Progress</span>
          <span>{processingProgress}%</span>
        </div>
      </div>
    </AppWrapper>
  );
}
