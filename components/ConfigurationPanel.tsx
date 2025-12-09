import React, { useState, useRef } from 'react';
import { AppConfig, DisciplineKey, UploadedFile } from '../types';
import { ACADEMIC_LEVELS, DISCIPLINES, MAX_CRITERIA, MIN_CRITERIA, MAX_TOTAL_FILE_SIZE_BYTES } from '../constants';
import ThemeToggle from './ThemeToggle';
import { 
    LogoIcon, PanelCloseIcon, InfoIcon, HistoryIcon, 
    UploadCloudIcon, FileTextIcon, XCircleIcon, PlusCircleIcon, MinusCircleIcon,
    GeneralIcon, KeyIcon
} from './icons';

interface ConfigurationPanelProps {
    config: AppConfig;
    setConfig: React.Dispatch<React.SetStateAction<AppConfig>>;
    files: UploadedFile[];
    setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
    isAnalyzing: boolean;
    onSubmit: () => void;
    onReset: () => void;
    savedReportsCount: number;
    toggleHistory: () => void;
    toggleAbout: () => void;
    toggleSettings: () => void;
    isOpen: boolean;
    setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
    theme: string;
    toggleTheme: (event: React.MouseEvent) => void;
}

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve((reader.result as string).split(',')[1]);
        reader.onerror = error => reject(error);
    });
};

const getMimeType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  if (!extension) return 'text/plain'; 
  const mimeTypes: Record<string, string> = {
    'txt': 'text/plain', 'md': 'text/markdown', 'pdf': 'application/pdf', 
    'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  };
  return mimeTypes[extension] || 'text/plain';
};

const formatBytes = (bytes: number): string => {
    if (bytes <= 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const ConfigurationPanel: React.FC<ConfigurationPanelProps> = ({
    config, setConfig, files, setFiles, isAnalyzing, onSubmit, onReset,
    savedReportsCount, toggleHistory, toggleAbout, toggleSettings, isOpen, setIsOpen,
    theme, toggleTheme
}) => {

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [fileError, setFileError] = useState<string | null>(null);

    const handleConfigChange = (field: keyof AppConfig, value: any) => {
        setConfig(prev => ({ ...prev, [field]: value }));
    };

    const handleDisciplineChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newDiscipline = e.target.value as DisciplineKey;
        setConfig(prev => ({
            ...prev,
            discipline: newDiscipline,
            evaluationCriteria: DISCIPLINES[newDiscipline].criteria,
            customDiscipline: newDiscipline === 'Other' ? prev.customDiscipline : '',
        }));
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFileError(null);
            const newSelectedFiles: File[] = Array.from(e.target.files);
            const currentSize = files.reduce((total, file) => total + file.size, 0);
            const newFilesSize = newSelectedFiles.reduce((total, file) => total + file.size, 0);

            if (currentSize + newFilesSize > MAX_TOTAL_FILE_SIZE_BYTES) {
                setFileError(`Total size limit is 15MB.`);
                if (fileInputRef.current) fileInputRef.current.value = '';
                return;
            }

            const newFilesPromises = newSelectedFiles.map(async (file: File) => ({
                name: file.name,
                type: file.type || getMimeType(file.name),
                size: file.size,
                content: await fileToBase64(file),
            }));
            const newFiles = await Promise.all(newFilesPromises);
            setFiles(prev => [...prev, ...newFiles]);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeFile = (fileName: string) => {
        setFiles(prev => prev.filter(f => f.name !== fileName));
        setFileError(null);
    };

    const handleCriteriaChange = (index: number, value: string) => {
        const newCriteria = [...config.evaluationCriteria];
        newCriteria[index] = value;
        handleConfigChange('evaluationCriteria', newCriteria);
    };

    const addCriteria = () => {
        if (config.evaluationCriteria.length < MAX_CRITERIA) {
            handleConfigChange('evaluationCriteria', [...config.evaluationCriteria, '']);
        }
    };
    
    const removeCriteria = (index: number) => {
        if (config.evaluationCriteria.length > MIN_CRITERIA) {
            const newCriteria = config.evaluationCriteria.filter((_, i) => i !== index);
            handleConfigChange('evaluationCriteria', newCriteria);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit();
    };

    const isSubmitDisabled = !config.projectTitle || !config.evaluationContext || isAnalyzing;
    const DisciplineIcon = DISCIPLINES[config.discipline as DisciplineKey]?.icon || GeneralIcon;

    return (
        <>
        <div className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-30 transition-opacity duration-500 md:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={() => setIsOpen(false)} aria-hidden="true" />
            
        <aside className={`fixed top-0 left-0 h-full w-full md:w-[400px] z-40 flex flex-col transition-transform duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isOpen ? 'translate-x-0' : '-translate-x-full'} bg-[--bg-secondary]/80 backdrop-blur-2xl border-r border-[--border]`}>
            
            {/* Toolbar */}
            <div className="flex-shrink-0 h-16 px-5 flex items-center justify-between border-b border-[--border]">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[--fg-primary] text-[--bg-primary] flex items-center justify-center">
                        <LogoIcon className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold tracking-tight text-[--fg-primary] leading-none">ASAP AI</span>
                        <span className="text-[10px] text-[--fg-tertiary] font-medium leading-none mt-1">by nbl.</span>
                    </div>
                </div>
                <div className="flex items-center gap-0.5">
                     <button onClick={toggleSettings} className="p-2 rounded-xl text-[--fg-secondary] hover:bg-[--bg-tertiary] transition-colors"><KeyIcon className="w-5 h-5"/></button>
                     <button onClick={toggleHistory} className="p-2 rounded-xl text-[--fg-secondary] hover:bg-[--bg-tertiary] transition-colors relative">
                        <HistoryIcon className="w-5 h-5"/>
                        {savedReportsCount > 0 && <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[--accent]"></span>}
                    </button>
                    <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    <button onClick={toggleAbout} className="p-2 rounded-xl text-[--fg-secondary] hover:bg-[--bg-tertiary] transition-colors">
                        <InfoIcon className="w-5 h-5"/>
                    </button>
                    
                    <div className="w-px h-4 bg-[--border] mx-1"></div>
                    
                    <button onClick={() => setIsOpen(false)} className="p-2 rounded-xl text-[--fg-secondary] hover:bg-[--bg-tertiary] transition-colors" title="Hide Panel">
                        <PanelCloseIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            {/* Scrollable Content */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-8 pb-10">
                
                {/* Project Info */}
                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xs font-semibold text-[--fg-tertiary] uppercase tracking-wide">Project Information</h2>
                    </div>

                    <div className="space-y-3">
                        <input type="text" placeholder="Project Title" value={config.projectTitle} onChange={e => handleConfigChange('projectTitle', e.target.value)}
                            className="w-full bg-[--bg-primary] border-none rounded-xl px-4 py-3 text-sm shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none transition-all placeholder:text-[--fg-tertiary]" />
                        
                        <div className="grid grid-cols-2 gap-3">
                             <div className="relative">
                                <select value={config.discipline} onChange={handleDisciplineChange}
                                    className="w-full bg-[--bg-primary] border-none rounded-xl pl-9 pr-8 py-3 text-sm shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none appearance-none cursor-pointer">
                                    {Object.keys(DISCIPLINES).map(d => <option key={d} value={d}>{d}</option>)}
                                </select>
                                <DisciplineIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[--fg-secondary] pointer-events-none" />
                            </div>
                            <div className="relative">
                                <select value={config.academicLevel} onChange={e => handleConfigChange('academicLevel', e.target.value)}
                                    className="w-full bg-[--bg-primary] border-none rounded-xl px-4 py-3 text-sm shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none appearance-none cursor-pointer">
                                    {ACADEMIC_LEVELS.map(l => <option key={l}>{l}</option>)}
                                </select>
                            </div>
                        </div>

                        {config.discipline === 'Other' && (
                            <input type="text" placeholder="Specify Field" value={config.customDiscipline} onChange={e => handleConfigChange('customDiscipline', e.target.value)}
                                className="w-full bg-[--bg-primary] border-none rounded-xl px-4 py-3 text-sm shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none transition-all animate-scale-up" />
                        )}
                        
                         <input type="url" placeholder="Project URL (Optional)" value={config.projectURL} onChange={e => handleConfigChange('projectURL', e.target.value)}
                            className="w-full bg-[--bg-primary] border-none rounded-xl px-4 py-3 text-sm shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none transition-all placeholder:text-[--fg-tertiary]" />
                    </div>
                </section>

                {/* Context */}
                <section className="space-y-4">
                     <h2 className="text-xs font-semibold text-[--fg-tertiary] uppercase tracking-wide">Context & Criteria</h2>
                     <textarea placeholder="Describe the assignment or project goal..." value={config.evaluationContext} onChange={e => handleConfigChange('evaluationContext', e.target.value)}
                        className="w-full bg-[--bg-primary] border-none rounded-xl px-4 py-3 text-sm min-h-[100px] shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none transition-all placeholder:text-[--fg-tertiary] resize-none" />
                    
                    <div className="space-y-2">
                        {config.evaluationCriteria.map((criterion, index) => (
                            <div key={index} className="flex gap-2">
                                <input type="text" value={criterion} onChange={e => handleCriteriaChange(index, e.target.value)}
                                    className="w-full bg-[--bg-primary] border-none rounded-xl px-4 py-2 text-sm shadow-sm ring-1 ring-[--border] focus:ring-2 focus:ring-[--accent] outline-none transition-all" />
                                <button type="button" onClick={() => removeCriteria(index)} disabled={config.evaluationCriteria.length <= MIN_CRITERIA}
                                    className="p-2 text-[--fg-tertiary] hover:text-[--danger] transition-colors disabled:opacity-20"><MinusCircleIcon className="w-5 h-5"/></button>
                            </div>
                        ))}
                        <button type="button" onClick={addCriteria} disabled={config.evaluationCriteria.length >= MAX_CRITERIA} 
                            className="w-full py-2 flex items-center justify-center gap-1.5 text-sm font-medium text-[--accent] bg-[--accent]/5 hover:bg-[--accent]/10 rounded-xl transition-colors disabled:opacity-50">
                            <PlusCircleIcon className="w-4 h-4"/> Add Criterion
                        </button>
                    </div>
                </section>

                {/* Files */}
                 <section className="space-y-4">
                    <h2 className="text-xs font-semibold text-[--fg-tertiary] uppercase tracking-wide">Assets</h2>
                    
                    <div className="space-y-2">
                        {files.map(file => (
                            <div key={file.name} className="flex items-center gap-3 bg-[--bg-primary] px-3 py-2.5 rounded-xl shadow-sm ring-1 ring-[--border]">
                                <FileTextIcon className="w-4 h-4 text-[--accent]" />
                                <div className="flex-1 min-w-0">
                                    <p className="truncate text-sm font-medium text-[--fg-primary]">{file.name}</p>
                                    <p className="text-[10px] text-[--fg-tertiary]">{formatBytes(file.size)}</p>
                                </div>
                                <button onClick={() => removeFile(file.name)} className="text-[--fg-tertiary] hover:text-[--danger]"><XCircleIcon className="w-4 h-4" /></button>
                            </div>
                        ))}
                    </div>

                    <div onClick={() => fileInputRef.current?.click()}
                        className="group flex flex-col items-center justify-center py-6 border border-dashed border-[--fg-tertiary]/30 rounded-xl cursor-pointer hover:bg-[--bg-tertiary]/50 transition-colors">
                        <UploadCloudIcon className="h-6 w-6 text-[--accent] mb-2" />
                        <span className="text-sm font-medium text-[--fg-secondary] group-hover:text-[--fg-primary]">Upload Documents</span>
                        <input ref={fileInputRef} type="file" className="sr-only" multiple onChange={handleFileChange} />
                    </div>
                    {fileError && <p className="text-xs text-[--danger] text-center">{fileError}</p>}
                </section>
                
                 {/* Originality Toggle (In Flow) */}
                 <div className="flex items-center justify-between bg-[--bg-primary] p-4 rounded-xl shadow-sm ring-1 ring-[--border]">
                    <div className="flex flex-col">
                        <span className="text-sm font-medium text-[--fg-primary]">Originality Check</span>
                        <span className="text-xs text-[--fg-secondary]">Analyze conceptual uniqueness</span>
                    </div>
                    <button type="button" onClick={() => handleConfigChange('checkOriginality', !config.checkOriginality)}
                        className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none ${config.checkOriginality ? 'bg-[--success]' : 'bg-[--bg-tertiary]'}`}>
                        <span className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform duration-300 ${config.checkOriginality ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </button>
                </div>

                <div className="pt-4 flex gap-3">
                     <button type="button" onClick={onReset} className="px-5 py-3 text-sm font-medium text-[--fg-secondary] hover:text-[--fg-primary] transition-colors">Reset</button>
                     <button type="submit" disabled={isSubmitDisabled}
                        className="flex-1 bg-[--fg-primary] text-[--bg-primary] py-3 rounded-xl font-semibold text-sm shadow-lg shadow-[--fg-primary]/10 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                        {isAnalyzing ? 'Processing...' : 'Analyze Project'}
                    </button>
                </div>
            </form>
        </aside>
        </>
    );
};

export default ConfigurationPanel;