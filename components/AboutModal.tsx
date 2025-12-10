import React from 'react';
import { XIcon, LogoIcon, CheckBadgeIcon, SparklesIcon, ShieldCheckIcon } from './icons';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const AboutModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[--background-secondary]/80 backdrop-blur-xl rounded-3xl w-full max-w-lg m-4 border border-[--border] animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 md:p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[--accent] p-2 rounded-xl shadow-lg shadow-[--accent]/20">
                  <LogoIcon className="w-7 h-7 text-[--accent-foreground]" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-[--foreground]">About ASAP AI</h2>
                <p className="text-sm text-[--foreground-secondary] -mt-0.5">Your Partner in Academic Excellence</p>
              </div>
            </div>
            <button onClick={onClose} aria-label="Close about modal" className="p-2 -mr-2 rounded-full text-[--foreground-secondary] hover:bg-[--background-tertiary]">
              <XIcon />
            </button>
          </div>
          
          <div className="text-sm text-[--foreground-secondary] space-y-6 leading-relaxed">
            <div>
              <h3 className="font-semibold text-[--foreground] mb-2">Our Mission</h3>
              <p>
                To provide instant, intelligent evaluation for the modern scholar. We deliver comprehensive, constructive, and context-aware feedback to elevate academic and professional work to the highest standard.
              </p>
            </div>
            
            <div>
              <h3 className="font-semibold text-[--foreground] mb-3">Core Features</h3>
              <ul className="space-y-3">
                <FeatureItem icon={<CheckBadgeIcon />} title="Comprehensive Analysis" description="Receive detailed scores and qualitative feedback across multiple, customizable evaluation criteria." />
                <FeatureItem icon={<SparklesIcon />} title="Conceptual Originality Check" description="Our AI assesses your work for conceptual uniqueness, identifying areas of potential overlap with existing literature." />
                <FeatureItem icon={<ShieldCheckIcon />} title="Defense Preparation" description="Generate challenging, tailored questions to ensure you're fully prepared for any project defense or viva." />
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-[--foreground] mb-2">Our Philosophy</h3>
              <p>
                We believe in rigorous, objective, and unflinchingly honest feedback. ASAP AI is designed to be a demanding partner in your pursuit of excellence, helping you identify weaknesses and pushing you to achieve unparalleled quality.
              </p>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-[--border] text-center">
             <button onClick={onClose} className="w-full sm:w-auto px-8 py-2.5 text-sm font-semibold bg-[--accent] text-[--accent-foreground] rounded-2xl hover:opacity-95 active:scale-[0.98] transition-all">
                Close
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureItem: React.FC<{icon: React.ReactNode, title: string, description: string}> = ({ icon, title, description }) => (
  <li className="flex items-start gap-3">
    <div className="w-5 h-5 text-[--accent] flex-shrink-0 mt-0.5">{icon}</div>
    <div>
      <h4 className="font-medium text-[--foreground]">{title}</h4>
      <p className="text-xs text-[--foreground-secondary]">{description}</p>
    </div>
  </li>
)

export default AboutModal;