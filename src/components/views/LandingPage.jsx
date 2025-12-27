import React, { useRef, useEffect } from 'react';
import PixelSnow from '../common/PixelSnow';
import { ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import useAppStore from '../../store/useAppStore';

export default function LandingPage() {
  const { setAppState } = useAppStore();
  const landingContainerRef = useRef(null);

  // Parallax Effect for Landing Page
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!landingContainerRef.current) return;
      const xAxis = (window.innerWidth / 2 - e.pageX) / 50;
      const yAxis = (window.innerHeight / 2 - e.pageY) / 50;
      landingContainerRef.current.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
    };

    document.addEventListener('mousemove', handleMouseMove);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none">
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

      <main className="fixed top-0 left-0 w-full h-full overflow-y-auto flex flex-col items-center justify-center z-50 p-5 bg-[#030712] text-white font-sans">
        <div
          ref={landingContainerRef}
          className="relative w-full max-w-[800px] px-10 py-12 text-center backdrop-blur-[20px] bg-[rgba(10,15,30,0.85)] border border-[rgba(255,255,255,0.08)] rounded-[40px] shadow-[0_25px_80px_-12px_rgba(0,0,0,0.8),0_0_60px_rgba(59,130,246,0.1)] transform-3d z-[1] m-auto animate-[entry_1.2s_cubic-bezier(0.16,1,0.3,1)]"
        >
          {/* Logo Area */}
          <div className="flex items-center justify-center gap-3 mb-8">
            <div
                className="w-[42px] h-[42px] bg-[linear-gradient(135deg,#e2e8f0_0%,#94a3b8_50%,#f8fafc_100%)] mask-[url('data:image/svg+xml,%3Csvg_xmlns=%27http://www.w3.org/2000/svg%27_viewBox=%270_0_24_24%27_fill=%27none%27_stroke=%27black%27_stroke-width=%272%27_stroke-linecap=%27round%27_stroke-linejoin=%27round%27%3E%3Cpath_d=%27M12_4.5a2.5_2.5_0_0_0-4.96-.46_2.5_2.5_0_0_0-1.98_3_2.5_2.5_0_0_0_.98_4.96_2.5_2.5_0_0_0_0_5_2.5_2.5_0_0_0_4.96-.46_2.5_2.5_0_0_0_1.98-3_2.5_2.5_0_0_0-.98-4.96_2.5_2.5_0_0_0_0-5z%27/%3E%3Cpath_d=%27M12_4.5V19.5%27/%3E%3Cpath_d=%27M12_7.5h3.5a2.5_2.5_0_0_1_0_5H12%27/%3E%3Cpath_d=%27M12_12.5h5.5a2.5_2.5_0_0_1_0_5H12%27/%3E%3C/svg%3E')_no-repeat_center]"
                style={{
                    WebkitMask: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M12 4.5a2.5 2.5 0 0 0-4.96-.46 2.5 2.5 0 0 0-1.98 3 2.5 2.5 0 0 0 .98 4.96 2.5 2.5 0 0 0 0 5 2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 1.98-3 2.5 2.5 0 0 0-.98-4.96 2.5 2.5 0 0 0 0-5z'/%3E%3Cpath d='M12 4.5V19.5'/%3E%3Cpath d='M12 7.5h3.5a2.5 2.5 0 0 1 0 5H12'/%3E%3Cpath d='M12 12.5h5.5a2.5 2.5 0 0 1 0 5H12'/%3E%3C/svg%3E\") no-repeat center"
                }}
            ></div>
            <span className="font-bold text-[28px] tracking-tight bg-[linear-gradient(135deg,#e2e8f0_0%,#94a3b8_50%,#f8fafc_100%)] text-transparent bg-clip-text">WiseExtract</span>
          </div>

          <h1 className="text-6xl font-bold leading-[1.1] mb-5 bg-gradient-to-b from-white to-slate-400 text-transparent bg-clip-text tracking-tight sm:text-4xl xs:text-3xl">
            Extract Photos<br />from PDFs
          </h1>

          <p className="text-lg text-slate-400 mb-10 font-normal sm:text-base sm:mb-7">
            Intelligent separation of imagery and iconography.
          </p>

          {/* AI Badge */}
          <div className="inline-flex flex-col gap-2 p-5 border border-blue-500/25 rounded-[20px] bg-gradient-to-br from-blue-500/15 to-cyan-500/10 mb-10 relative overflow-hidden max-w-full sm:p-4 sm:mb-7">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.05),transparent)] rotate-45 animate-[shine_4s_infinite_linear]"></div>
            <div className="flex items-center justify-center gap-2 text-sky-400 font-semibold uppercase text-xs tracking-[2px] sm:text-[11px]">
              <Sparkles className="w-[18px] h-[18px]" />
              High-Precision AI
            </div>
            <p className="text-sm text-slate-300 max-w-[320px] leading-relaxed sm:text-[13px]">
              Thinking Mode Analysis with 32k token budget for RAG-Ready context descriptions.
            </p>
          </div>

          <div>
            <button
                onClick={() => setAppState('UPLOAD')}
                className="relative inline-flex items-center gap-3 px-11 py-[18px] text-[17px] font-semibold text-[#030712] bg-[linear-gradient(135deg,#e2e8f0_0%,#94a3b8_50%,#f8fafc_100%)] border-none rounded-full cursor-pointer overflow-hidden transition-all duration-400 cubic-bezier(0.23,1,0.32,1) shadow-[0_4px_20px_rgba(255,255,255,0.15)] hover:translate-y-[-4px] hover:scale-[1.02] hover:shadow-[0_20px_40px_-10px_rgba(255,255,255,0.25)] group sm:px-9 sm:py-4 sm:text-[15px]"
            >
              Get Started
              <ArrowRight className="w-5 h-5 transition-transform duration-400 ease group-hover:translate-x-[5px]" />
            </button>
          </div>

          <div className="mt-10 inline-flex items-center gap-2.5 px-5 py-2.5 bg-black/40 border border-[rgba(255,255,255,0.08)] rounded-full text-xs text-slate-400 max-w-full text-center sm:mt-7 sm:px-4 sm:py-2 sm:text-[11px]">
            <ShieldCheck className="w-[14px] text-emerald-500 flex-shrink-0" />
            Privacy First: Files never leave your local environment.
          </div>

          <div className="mt-10 w-full text-[11px] color-slate-600 tracking-wider sm:mt-7 sm:text-[10px]">
            WiseExtract • Developed by <a href="https://magdysaber.com" target="_blank" rel="noopener noreferrer" className="text-slate-400 no-underline transition-colors hover:text-white">Magdy Saber</a>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes shine {
            0% { transform: translateX(-100%) rotate(45deg); }
            100% { transform: translateX(100%) rotate(45deg); }
        }
        @keyframes entry {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </>
  );
}
