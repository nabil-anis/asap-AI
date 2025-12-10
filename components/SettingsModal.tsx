
import React, { useState, useEffect } from 'react';
import { XIcon, KeyIcon, ExternalLinkIcon, CheckCircleIcon } from './icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customApiKey: string;
    hasEnvKey: boolean;
    onSave: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, customApiKey, hasEnvKey, onSave }) => {
    const [inputKey, setInputKey] = useState(customApiKey);

    useEffect(() => {
        setInputKey(customApiKey);
    }, [customApiKey, isOpen]);

    const handleSave = () => {
        onSave(inputKey.trim());
        onClose();
    };

    if (!isOpen) return null;

    const isUsingEnvKey = !inputKey && hasEnvKey;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-[--bg-primary] rounded-3xl w-full max-w-md shadow-2xl border border-[--border] animate-scale-up overflow-hidden"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-6 border-b border-[--border] flex justify-between items-center bg-[--bg-secondary]/30">
                    <h2 className="font-bold text-lg text-[--fg-primary]">API Configuration</h2>
                    <button onClick={onClose} className="p-1.5 rounded-full bg-[--bg-secondary] text-[--fg-secondary] hover:bg-[--bg-tertiary] transition-colors"><XIcon className="w-4 h-4"/></button>
                </div>

                <div className="p-6 space-y-5">
                    
                    {/* Status Indicator */}
                    <div className="flex items-center justify-between bg-[--bg-secondary] p-3 rounded-xl border border-[--border]">
                        <span className="text-sm font-medium text-[--fg-secondary]">System Key Status</span>
                        {hasEnvKey ? (
                             <div className="flex items-center gap-1.5 text-[--success] bg-[--success]/10 px-2.5 py-1 rounded-full">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                <span className="text-xs font-bold uppercase tracking-wide">Active</span>
                             </div>
                        ) : (
                             <div className="flex items-center gap-1.5 text-[--warning] bg-[--warning]/10 px-2.5 py-1 rounded-full">
                                <div className="w-1.5 h-1.5 rounded-full bg-[--warning]"></div>
                                <span className="text-xs font-bold uppercase tracking-wide">Not Detected</span>
                             </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-medium text-[--fg-primary]">Custom API Key</label>
                            <a 
                                href="https://aistudio.google.com/app/apikey" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-xs text-[--accent] hover:underline font-medium"
                            >
                                Get Key <ExternalLinkIcon className="w-3 h-3" />
                            </a>
                        </div>
                        <div className="relative group">
                            <KeyIcon className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${isUsingEnvKey ? 'text-[--success]' : 'text-[--fg-tertiary] group-focus-within:text-[--accent]'}`} />
                            <input 
                                type="password" 
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder={hasEnvKey ? "Using System Key (Leave empty to use)" : "AIzaSy..."}
                                className={`w-full bg-[--bg-primary] border rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all placeholder:text-[--fg-tertiary] ${isUsingEnvKey ? 'border-[--success]/30 ring-1 ring-[--success]/20' : 'border-[--border] focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/10'}`}
                            />
                        </div>
                        <p className="text-[10px] text-[--fg-tertiary] px-1 leading-relaxed">
                            {hasEnvKey 
                                ? "A system key is available. To use it, simply leave this field empty and save." 
                                : "No system key detected. You must provide a custom key to perform analysis."}
                        </p>
                    </div>
                </div>

                <div className="p-4 border-t border-[--border] flex gap-3 bg-[--bg-secondary]/10">
                    <button onClick={onClose} className="flex-1 py-3 text-sm font-medium text-[--fg-secondary] hover:bg-[--bg-secondary] rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex-1 py-3 text-sm font-semibold bg-[--accent] text-white rounded-xl hover:bg-[--accent-hover] transition-colors shadow-lg shadow-[--accent]/20 active:scale-[0.98] transform">
                        {inputKey ? 'Save Custom Key' : (hasEnvKey ? 'Use System Key' : 'Save')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
