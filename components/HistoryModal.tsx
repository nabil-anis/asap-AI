import React from 'react';
import { XIcon, HistoryIcon, TrashIcon } from './icons';
import { ReportHistoryItem } from '../types';

interface HistoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    history: ReportHistoryItem[];
    onLoad: (item: ReportHistoryItem) => void;
    onDelete: (id: string) => void;
    onClear: () => void;
}

const HistoryModal: React.FC<HistoryModalProps> = ({ isOpen, onClose, history, onLoad, onDelete, onClear }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[--bg-primary] rounded-3xl w-full max-w-lg shadow-2xl border border-[--border] animate-scale-up h-[70vh] flex flex-col overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-5 border-b border-[--border] flex justify-between items-center bg-[--bg-secondary]/30">
           <div className="flex items-center gap-2">
                <HistoryIcon className="w-5 h-5 text-[--fg-primary]" />
                <h2 className="font-bold text-lg text-[--fg-primary]">History</h2>
           </div>
           <button onClick={onClose} className="p-1.5 rounded-full bg-[--bg-secondary] text-[--fg-secondary] hover:bg-[--bg-tertiary]"><XIcon className="w-4 h-4"/></button>
        </div>
        
        <div className="flex-grow overflow-y-auto no-scrollbar p-4">
          {history.length > 0 ? (
            <ul className="space-y-2">
              {history.map(item => (
                <li key={item.id} className="group bg-[--bg-secondary]/50 hover:bg-[--bg-secondary] border border-transparent hover:border-[--border] p-3 rounded-xl flex justify-between items-center transition-all cursor-pointer" onClick={() => onLoad(item)}>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-[--fg-primary] truncate">{item.projectTitle}</p>
                    <p className="text-[10px] text-[--fg-tertiary]">{item.date}</p>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} className="p-2 opacity-0 group-hover:opacity-100 rounded-full text-[--fg-tertiary] hover:text-[--danger] hover:bg-[--danger]/10 transition-all">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-[--fg-tertiary]">
              <p className="text-sm">No analysis history found.</p>
            </div>
          )}
        </div>

        {history.length > 0 && (
            <div className="p-4 border-t border-[--border]">
                <button onClick={onClear} className="w-full py-2.5 text-xs font-semibold text-[--danger] bg-[--danger]/5 rounded-xl hover:bg-[--danger]/10 transition-colors">
                    Clear History
                </button>
            </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;