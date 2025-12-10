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
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center animate-fade-in" onClick={onClose}>
      <div 
        className="bg-[--background-secondary]/80 backdrop-blur-xl rounded-3xl w-full max-w-2xl m-4 border border-[--border] animate-slide-up flex flex-col h-[70vh]"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6 border-b border-[--border]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <HistoryIcon className="w-6 h-6 text-[--foreground-secondary]" />
              <h2 className="font-semibold text-lg text-[--foreground]">Report History</h2>
            </div>
            <button onClick={onClose} aria-label="Close history modal" className="p-2 -mr-2 rounded-full text-[--foreground-secondary] hover:bg-[--background-tertiary]">
              <XIcon />
            </button>
          </div>
        </div>
        
        <div className="flex-grow overflow-y-auto p-6">
          {history.length > 0 ? (
            <ul className="space-y-3">
              {history.map(item => (
                <li key={item.id} className="bg-[--background] p-3 rounded-xl flex justify-between items-center gap-4 transition-colors hover:bg-[--background-tertiary]">
                  <div className="truncate cursor-pointer flex-grow" onClick={() => onLoad(item)}>
                    <p className="font-medium text-sm text-[--foreground] truncate">{item.projectTitle}</p>
                    <p className="text-xs text-[--foreground-secondary]">{item.date}</p>
                  </div>
                  <button onClick={() => onDelete(item.id)} aria-label={`Delete report for ${item.projectTitle}`} className="p-2 rounded-full text-[--foreground-secondary] hover:bg-red-500/10 hover:text-red-500 transition-colors">
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-12">
              <p className="text-[--foreground-secondary]">No reports saved yet.</p>
              <p className="text-xs text-[--foreground-secondary] mt-1">Your generated reports will appear here.</p>
            </div>
          )}
        </div>

        {history.length > 0 && (
          <div className="p-4 border-t border-[--border] text-right">
             <button onClick={onClear} className="px-4 py-2 text-sm font-semibold bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500/20 transition-colors">
                Clear All History
              </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HistoryModal;