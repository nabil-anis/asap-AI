
import React, { useState, useEffect } from 'react';
import { XIcon, KeyIcon, ExternalLinkIcon } from './icons';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
    customApiKey: string;
    onSave: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, customApiKey, onSave }) => {
    const [inputKey, setInputKey] = useState(customApiKey);

    useEffect(() => {
        setInputKey(customApiKey);
    }, [customApiKey, isOpen]);

    const handleSave = () => {
        onSave(inputKey.trim());
        onClose();
    };

    if (!isOpen) return null;

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
                    
                    <p className="text-sm text-[--fg-secondary] leading-relaxed">
                        ASAP AI is configured to work automatically. However, if you have your own high-limit API key, you can enter it below to override the system default.
                    </p>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-medium text-[--fg-primary]">Custom API Key (Optional)</label>
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
                            <KeyIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--fg-tertiary] group-focus-within:text-[--accent]" />
                            <input 
                                type="password" 
                                value={inputKey}
                                onChange={(e) => setInputKey(e.target.value)}
                                placeholder="Enter your key to override default..."
                                className="w-full bg-[--bg-primary] border rounded-xl pl-9 pr-4 py-3 text-sm outline-none transition-all placeholder:text-[--fg-tertiary] border-[--border] focus:border-[--accent] focus:ring-2 focus:ring-[--accent]/10"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-[--border] flex gap-3 bg-[--bg-secondary]/10">
                    <button onClick={onClose} className="flex-1 py-3 text-sm font-medium text-[--fg-secondary] hover:bg-[--bg-secondary] rounded-xl transition-colors">Cancel</button>
                    <button onClick={handleSave} className="flex-1 py-3 text-sm font-semibold bg-[--accent] text-white rounded-xl hover:bg-[--accent-hover] transition-colors shadow-lg shadow-[--accent]/20 active:scale-[0.98] transform">
                        Save Configuration
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;
