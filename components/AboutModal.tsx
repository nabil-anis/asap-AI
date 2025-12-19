import React from 'react';
import { XIcon, LogoIcon, CheckBadgeIcon, SparklesIcon, ShieldCheckIcon } from './icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/80 z-50 flex items-center justify-center animate-fade-in p-4" onClick={onClose}>
      <div 
        className="bg-[--background-secondary] backdrop-blur-2xl rounded-[2.5rem] w-full max-w-xl border border-[--border] shadow-2xl animate-slide-up overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-start mb-10">
            <div className="flex items-center gap-5">
              <div className="bg-[--accent] p-3 rounded-2xl shadow-xl shadow-[--accent]/20">
                  <LogoIcon className="w-8 h-8 text-[--accent-foreground]" />
              </div>
              <div>
                <h2 className="font-extrabold text-2xl text-[--foreground] tracking-tight">ASAP AI</h2>
                <p className="text-xs font-semibold text-[--foreground-tertiary] uppercase tracking-widest mt-1">Scholarly Excellence</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close modal" className="p-2 -mr-2 rounded-full text-[--foreground-secondary] hover:bg-[--background-tertiary] transition-colors">
              <XIcon className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-sm text-[--foreground-secondary] space-y-8 leading-relaxed">
            <section>
              <h3 className="font-bold text-[--foreground] text-base mb-3 tracking-tight">The Vision</h3>
              <p>
                ASAP AI provides instant, intelligent evaluation for the modern scholar. We deliver comprehensive, constructive, and context-aware feedback to elevate academic and professional work to the highest standard.
              </p>
            </section>
            
            <section>
              <h3 className="font-bold text-[--foreground] text-base mb-4 tracking-tight">Core Protocol</h3>
              <ul className="space-y-5">
                <FeatureItem icon={<CheckBadgeIcon />} title="Analytical Precision" description="Detailed scoring and qualitative feedback across customizable evaluation criteria." />
                <FeatureItem icon={<SparklesIcon />} title="Originality Assessment" description="Evaluation of conceptual uniqueness and literary overlap using advanced reasoning." />
                <FeatureItem icon={<ShieldCheckIcon />} title="Defense Preparation" description="Tailored challenging questions for project defense or viva readiness." />
              </ul>
            </section>

            <section>
              <h3 className="font-bold text-[--foreground] text-base mb-3 tracking-tight">Philosophy</h3>
              <p>
                We believe in rigorous, objective feedback. ASAP AI is designed to be a demanding partner in your pursuit of excellence, identifying weaknesses and pushing you to achieve unparalleled quality.
              </p>
            </section>
          </div>

          <div className="mt-12 pt-8 border-t border-[--border]">
             <button onClick={onClose} className="w-full py-4 text-sm font-bold bg-[--accent] text-[--accent-foreground] rounded-2xl hover:opacity-90 active:scale-[0.98] transition-all tracking-wide">
                DISMISS
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <li className="flex items-start gap-4">
    <div className="w-6 h-6 text-[--foreground] opacity-80 flex-shrink-0 mt-0.5">{icon}</div>
    <div>
      <h4 className="font-bold text-[--foreground] tracking-tight">{title}</h4>
      <p className="text-[11px] text-[--foreground-secondary] font-medium leading-relaxed mt-0.5">{description}</p>
    </div>
  </li>
)

export default AboutModal;