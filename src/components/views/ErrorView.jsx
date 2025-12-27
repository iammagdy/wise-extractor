import React from 'react';
import AppWrapper from '../layout/AppWrapper';
import { AlertTriangle } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function ErrorView() {
  const { errorDetails, resetState, setUseSmartExtraction, useSmartExtraction, setAppState } = useAppStore();

  return (
    <AppWrapper>
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
              className="px-6 sm:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold hover:from-blue-500 hover:to-blue-600 transition-colors shadow-lg text-sm sm:text-base cursor-pointer"
            >
              Try "Page to Image" Mode Instead
            </button>
          )}
          <button
            onClick={resetState}
            className="px-6 sm:px-8 py-3 bg-white/10 text-slate-300 rounded-lg font-semibold hover:bg-white/20 transition-colors border border-white/10 text-sm sm:text-base cursor-pointer"
          >
            Try Another File
          </button>
        </div>
      </div>
    </AppWrapper>
  );
}
