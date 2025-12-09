import React from 'react';
import { LogoIcon } from './icons';

interface WelcomeScreenProps {
    error?: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ error }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full min-h-[calc(100vh-4rem)] text-center animate-fade-in px-6">
        
        {/* Subtle Ambient Light */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[--accent] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center max-w-2xl mx-auto space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[--fg-primary] to-[--fg-secondary] flex items-center justify-center shadow-xl shadow-black/5">
               <LogoIcon className="w-8 h-8 text-[--bg-primary]" />
            </div>
            
            <div className="space-y-4">
                <h1 className="text-4xl md:text-6xl font-semibold tracking-tight text-[--fg-primary]">
                    Precision Analysis.
                    <br />
                    <span className="text-[--fg-secondary]">Instant Insight.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-[--fg-secondary] font-medium leading-relaxed max-w-lg mx-auto">
                    Evaluate your work with the intelligence of Gemini 3 Pro. Configured for academic and professional rigor.
                </p>
            </div>

            <div className="pt-4 flex items-center justify-center gap-2 text-sm font-medium text-[--accent] bg-[--accent]/5 px-4 py-1.5 rounded-full">
                <span>Configure project to begin</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </div>
        </div>

        {error && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-md bg-[--bg-secondary] border border-[--danger]/20 text-[--danger] text-sm p-4 rounded-2xl shadow-lg backdrop-blur-md">
                <strong>Analysis Failed</strong>
                <p className="opacity-90 mt-1">{error}</p>
            </div>
        )}
    </div>
  );
};

export default WelcomeScreen;