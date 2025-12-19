import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type, Part } from "@google/genai";
import ConfigurationPanel from './components/ConfigurationPanel';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryModal from './components/HistoryModal';
import AboutModal from './components/AboutModal';
import { SliderIcon } from './components/icons';
import { AppConfig, AnalysisResult, UploadedFile, ReportHistoryItem } from './types';
import { ACADEMIC_LEVELS, DISCIPLINES } from './constants';

const DEFAULT_CONFIG: AppConfig = {
  projectTitle: '',
  discipline: 'General',
  academicLevel: ACADEMIC_LEVELS[2],
  evaluationContext: '',
  projectURL: '',
  evaluationCriteria: DISCIPLINES['General'].criteria,
  checkOriginality: true,
  customDiscipline: '',
};

const App: React.FC = () => {
    const [config, setConfig] = useState<AppConfig>(DEFAULT_CONFIG);
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    const [isConfigPanelOpen, setIsConfigPanelOpen] = useState(true);
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);
    const [isAboutOpen, setIsAboutOpen] = useState(false);
    const [history, setHistory] = useState<ReportHistoryItem[]>([]);
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        const savedHistory = localStorage.getItem('asapai-history');
        if (savedHistory) {
            setHistory(JSON.parse(savedHistory));
        }
        const savedTheme = localStorage.getItem('asapai-theme') || 'dark';
        setTheme(savedTheme);
        
        if (window.innerWidth < 768) {
            setIsConfigPanelOpen(false);
        }
    }, []);

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('asapai-theme', theme);
    }, [theme]);

    const toggleTheme = (e: React.MouseEvent) => {
        e.stopPropagation();
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const handleReset = useCallback(() => {
        setConfig(DEFAULT_CONFIG);
        setFiles([]);
        setAnalysisResult(null);
        setError(null);
    }, []);
    
    const saveReportToHistory = (result: AnalysisResult) => {
        const newHistoryItem: ReportHistoryItem = {
            id: new Date().toISOString(),
            projectTitle: result.projectTitle,
            date: new Date().toLocaleString(),
            result,
        };
        const updatedHistory = [newHistoryItem, ...history];
        setHistory(updatedHistory);
        localStorage.setItem('asapai-history', JSON.stringify(updatedHistory));
    };

    const loadReportFromHistory = (item: ReportHistoryItem) => {
        setAnalysisResult(item.result);
        setIsHistoryOpen(false);
    };

    const deleteReportFromHistory = (id: string) => {
        const updatedHistory = history.filter(item => item.id !== id);
        setHistory(updatedHistory);
        localStorage.setItem('asapai-history', JSON.stringify(updatedHistory));
    };

    const clearHistory = () => {
        setHistory([]);
        localStorage.removeItem('asapai-history');
        setIsHistoryOpen(false);
    };
    
    const createResponseSchema = () => {
        const criteriaAnalysisSchema = {
            type: Type.OBJECT,
            properties: {
                name: { type: Type.STRING },
                score: { type: Type.INTEGER, description: 'Score from 0 to 100' },
                points: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['name', 'score', 'points']
        };

        const originalityFindingSchema = {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING }
            },
            required: ['title', 'description']
        };

        const originalityReportSchema = {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER, description: 'Score from 0 to 100' },
                summary: { type: Type.STRING },
                findings: { type: Type.ARRAY, items: originalityFindingSchema }
            },
            required: ['score', 'summary', 'findings']
        };

        const defensePrepQuestionSchema = {
            type: Type.OBJECT,
            properties: {
                number: { type: Type.INTEGER },
                question: { type: Type.STRING },
                answerOutline: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['number', 'question', 'answerOutline']
        };

        const defensePrepCategorySchema = {
            type: Type.OBJECT,
            properties: {
                categoryName: { type: Type.STRING },
                questions: { type: Type.ARRAY, items: defensePrepQuestionSchema }
            },
            required: ['categoryName', 'questions']
        };
        
        return {
            type: Type.OBJECT,
            properties: {
                overallScore: { type: Type.INTEGER },
                summaryTitle: { type: Type.STRING },
                discipline: { type: Type.STRING },
                academicLevel: { type: Type.STRING },
                criteriaAnalyses: { type: Type.ARRAY, items: criteriaAnalysisSchema },
                originalityReport: originalityReportSchema,
                overallAnalysis: { type: Type.STRING },
                suggestedActions: { type: Type.ARRAY, items: { type: Type.STRING } },
                defensePrep: { type: Type.ARRAY, items: defensePrepCategorySchema }
            },
            required: ['overallScore', 'summaryTitle', 'discipline', 'academicLevel', 'criteriaAnalyses', 'originalityReport', 'overallAnalysis', 'suggestedActions', 'defensePrep']
        };
    };

    const handleAnalyze = async () => {
        if (window.innerWidth < 768) {
            setIsConfigPanelOpen(false);
        }
        setIsAnalyzing(true);
        setError(null);
        setAnalysisResult(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            
            const disciplineName = config.discipline === 'Other' ? config.customDiscipline : config.discipline;
            
            const prompt = `
              **PRIMARY DIRECTIVE: Rigorous Academic/Professional Evaluation**
              Your role is to act as a demanding evaluator (professor, lead researcher, or executive). 
              Your feedback must be constructive but unflinchingly honest.
              
              Project Title: ${config.projectTitle}
              Discipline: ${disciplineName}
              Academic Level: ${config.academicLevel}
              Evaluation Context: ${config.evaluationContext}
              Project URL: ${config.projectURL}

              Evaluation Criteria:
              ${config.evaluationCriteria.map(c => `- ${c}`).join('\n')}

              Tasks:
              1. Deeply analyze the provided content against the criteria.
              2. Score fairly but strictly.
              3. Check for conceptual originality (AI-driven reasoning).
              4. Provide actionable improvements that would move this to a top-tier grade/standard.
              5. Generate a "Defense Preparation" set of 15+ probing questions grouped by category.
            `;
            
            const fileParts: Part[] = files.map(file => ({
                inlineData: { mimeType: file.type, data: file.content }
            }));

            const response = await ai.models.generateContent({
                model: 'gemini-3-pro-preview',
                contents: { parts: [{ text: prompt }, ...fileParts] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: createResponseSchema()
                }
            });
            
            const resultData = JSON.parse(response.text) as AnalysisResult;
            resultData.projectTitle = config.projectTitle;

            setAnalysisResult(resultData);
            saveReportToHistory(resultData);

        } catch (e: any) {
            console.error("Analysis failed:", e);
            if (e.message?.includes("RESOURCE_EXHAUSTED") || e.status === "RESOURCE_EXHAUSTED") {
                setError("Quota exceeded for the current API key. Please try again later or check your billing status at ai.google.dev.");
            } else {
                setError(e instanceof Error ? e.message : "Analysis failed due to a server error. Please ensure your API key is valid and you have an active connection.");
            }
            setAnalysisResult(null);
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="flex h-screen w-screen bg-[--background] text-[--foreground] font-sans overflow-hidden">
            <ConfigurationPanel
                config={config}
                setConfig={setConfig}
                files={files}
                setFiles={setFiles}
                isAnalyzing={isAnalyzing}
                onSubmit={handleAnalyze}
                onReset={handleReset}
                savedReportsCount={history.length}
                toggleHistory={() => setIsHistoryOpen(true)}
                toggleAbout={() => setIsAboutOpen(true)}
                isOpen={isConfigPanelOpen}
                setIsOpen={setIsConfigPanelOpen}
                theme={theme}
                toggleTheme={toggleTheme}
            />
            <main className="flex-1 flex flex-col h-screen transition-all duration-500 ease-in-out relative">
                 {!isConfigPanelOpen && (
                    <button 
                        onClick={() => setIsConfigPanelOpen(true)} 
                        className="hidden md:block fixed top-8 left-8 z-50 p-3 bg-[--background-secondary]/80 backdrop-blur rounded-2xl shadow-xl border border-[--border] hover:bg-[--background-tertiary] transition-all active:scale-95"
                        aria-label="Open configuration panel"
                    >
                        <SliderIcon className="w-6 h-6" />
                    </button>
                )}
                <div className="md:hidden flex-shrink-0 p-6 border-b border-[--border] flex items-center justify-between glass">
                    <button onClick={() => setIsConfigPanelOpen(true)} className="p-2">
                        <SliderIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight">ASAP AI</h1>
                    <div className="w-8"></div>
                </div>
                <div className="flex-1 overflow-y-auto p-6 md:p-16 pb-32 no-scrollbar">
                    <div className="max-w-6xl mx-auto">
                        {isAnalyzing ? <LoadingScreen /> : 
                         analysisResult ? <ResultsScreen result={analysisResult} projectTitle={config.projectTitle} /> : 
                         <WelcomeScreen error={error} />}
                    </div>
                    
                    <footer className="mt-32 py-12 border-t border-[--border] flex flex-col items-center opacity-30 hover:opacity-100 transition-opacity duration-700">
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase">design by nbl.</p>
                        <p className="mt-2 text-[9px] font-medium tracking-widest text-[--foreground-tertiary] uppercase">Advanced Scholarly Analysis Platform</p>
                    </footer>
                </div>
            </main>
            <HistoryModal
                isOpen={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                history={history}
                onLoad={loadReportFromHistory}
                onDelete={deleteReportFromHistory}
                onClear={clearHistory}
            />
            <AboutModal
                isOpen={isAboutOpen}
                onClose={() => setIsAboutOpen(false)}
            />
        </div>
    );
};

export default App;