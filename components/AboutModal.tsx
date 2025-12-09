
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
                ASAP AI. Because academic validation shouldn't take forever. 
                <span className="block mt-2 text-[--fg-secondary]">
                    We provide the rigorous critique your professor would give you, but without the office hour wait times or the judgmental sighs.
                </span>
            </p>

            <div className="space-y-4">
                <Feature icon={<CheckBadgeIcon />} title="Ruthless Scoring" desc="Because 'good enough' is rarely actually good enough." />
                <Feature icon={<SparklesIcon />} title="Originality Check" desc="Ensuring your brilliance is actually yours." />
                <Feature icon={<ShieldCheckIcon />} title="Viva Prep" desc="So you don't freeze when they ask 'Why?'" />
            </div>

            <div className="bg-[--bg-secondary] p-4 rounded-xl text-center">
                 <p className="text-xs font-semibold text-[--fg-primary] tracking-wide">
                    design by nbl.
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