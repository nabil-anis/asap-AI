import React from 'react';
import { XIcon, LogoIcon, CheckBadgeIcon, SparklesIcon, ShieldCheckIcon } from './icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[--bg-primary] rounded-3xl w-full max-w-md shadow-2xl border border-[--border] overflow-hidden animate-scale-up max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[--border] flex items-center justify-between bg-[--bg-secondary]/30">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[--fg-primary] rounded-lg flex items-center justify-center text-[--bg-primary]">
                    <LogoIcon className="w-5 h-5"/>
                </div>
                <h2 className="font-bold text-lg text-[--fg-primary]">About</h2>
             </div>
             <button onClick={onClose} className="p-2 rounded-full bg-[--bg-secondary] hover:bg-[--bg-tertiary] text-[--fg-secondary] transition-colors">
                <XIcon className="w-4 h-4" />
             </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto no-scrollbar space-y-6">
            <p className="text-[--fg-primary] font-medium leading-relaxed">
                ASAP AI delivers professional-grade analysis for the modern scholar.
            </p>

            <div className="space-y-4">
                <Feature icon={<CheckBadgeIcon />} title="Precision Scoring" desc="Detailed, criteria-based evaluation." />
                <Feature icon={<SparklesIcon />} title="Originality" desc="Conceptual uniqueness verification." />
                <Feature icon={<ShieldCheckIcon />} title="Viva Prep" desc="Defense questions and strategy." />
            </div>

            <div className="bg-[--bg-secondary] p-4 rounded-xl">
                <p className="text-xs text-[--fg-secondary] leading-relaxed text-center">
                    Designed to be an uncompromising partner in your pursuit of excellence. Powered by Google Gemini 3 Pro.
                </p>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[--border] bg-[--bg-primary]">
            <button onClick={onClose} className="w-full py-3 bg-[--fg-primary] text-[--bg-primary] font-semibold rounded-xl hover:opacity-90 active:scale-[0.98] transition-all text-sm">
                Close
            </button>
        </div>
      </div>
    </div>
  );
};

const Feature: React.FC<{icon: React.ReactNode, title: string, desc: string}> = ({ icon, title, desc }) => (
    <div className="flex items-center gap-3.5">
        <div className="text-[--accent]">{icon}</div>
        <div>
            <h3 className="text-sm font-semibold text-[--fg-primary]">{title}</h3>
            <p className="text-xs text-[--fg-secondary]">{desc}</p>
        </div>
    </div>
)

export default AboutModal;