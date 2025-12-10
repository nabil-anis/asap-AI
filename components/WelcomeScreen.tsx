import React from 'react';
import { LogoIcon } from './icons';

interface WelcomeScreenProps {
    error?: string | null;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ error }) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-[calc(100vh-12rem)] text-center animate-fade-in">
        <div className="absolute inset-0 -z-10 overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[--accent]/10 dark:bg-[--accent]/5 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s' }}></div>
        </div>
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-[--background-secondary] mb-6 border border-[--border] shadow-lg">
           <LogoIcon className="w-8 h-8 text-[--foreground-secondary]" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[--foreground]">
            Unlock Academic Excellence.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-[--foreground-secondary]">
            ASAP AI delivers rigorous, AI-driven analysis to elevate your research, writing, and presentations.
        </p>
        <p className="mt-8 max-w-xl text-md text-[--foreground-secondary]">
           Configure your evaluation in the side panel and receive unparalleled feedback in minutes.
        </p>
        {error && (
            <div className="mt-8 bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 text-sm p-4 rounded-xl max-w-xl">
                <strong>Analysis Error:</strong> {error}
            </div>
        )}
    </div>
  );
};

export default WelcomeScreen;