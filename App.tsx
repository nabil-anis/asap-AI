import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type, Part } from "@google/genai";
import ConfigurationPanel from './components/ConfigurationPanel';
import WelcomeScreen from './components/WelcomeScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultsScreen from './components/ResultsScreen';
import HistoryModal from './components/HistoryModal';
import AboutModal from './components/AboutModal';
import { SliderIcon } from './components/icons';
import { AppConfig, AnalysisResult, UploadedFile, ReportHistoryItem, DisciplineKey } from './types';
// FIX: Corrected typo from DISCIPLIPLINES to DISCIPLINES
import { ACADEMIC_LEVELS, DISCIPLINES } from './constants';

const DEFAULT_CONFIG: AppConfig = {
  projectTitle: '',
  discipline: 'General',
  academicLevel: ACADEMIC_LEVELS[2],
  evaluationContext: '',
  projectURL: '',
  // FIX: Corrected typo from DISCIPLIPLINES to DISCIPLINES
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
              **PRIMARY DIRECTIVE: Project-Content Coherence Check**
              Your FIRST and MOST CRITICAL task is to verify if the uploaded file content is coherent with the provided 'Project Context' (especially the Title, Discipline, and URL).

              - **IF a major discrepancy exists** (e.g., the title is 'Study Buddy Website' but the files contain a personal portfolio):
                  1.  You MUST explicitly state this mismatch as the primary finding in the 'overallAnalysis'.
                  2.  The 'summaryTitle' MUST reflect this, for example: "Project-Content Mismatch" or "Uploaded Files Do Not Match Project Title".
                  3.  The 'overallScore' MUST be severely penalized to a value below 30. A project that doesn't match its own description is a fundamental failure.
                  4.  All subsequent analysis (criteria, originality, etc.) MUST be performed on the submitted files but framed entirely within the context of this mismatch. For instance, a feedback point could be: "The code quality is adequate for a portfolio, but it is completely irrelevant to the stated 'Study Buddy' project goal."
              
              - **IF the content IS COHERENT** with the context, proceed with the standard, rigorous evaluation below.

              ---
              
              **Standard Evaluation Protocol:**
              You are ASAP AI, an expert academic and professional project evaluator. Your task is to perform a rigorous, objective analysis of the provided project, assuming it has passed the coherence check.
              
              **Project Context:**
              - Title: ${config.projectTitle}
              - Discipline: ${disciplineName}
              - Academic Level: ${config.academicLevel}
              - Evaluation Context: ${config.evaluationContext}
              - Project URL (if provided): ${config.projectURL}

              **Evaluation Criteria:**
              Please evaluate the project based on the following criteria:
              ${config.evaluationCriteria.map(c => `- ${c}`).join('\n')}

              **Your Tasks:**
              1.  **Overall Analysis:** Provide a holistic evaluation, synthesizing strengths and weaknesses.
              2.  **Criteria-Based Scoring:** For each criterion, provide a score from 0-100 and 2-4 specific, constructive feedback points.
              3.  **Originality Report:** ${config.checkOriginality ? 'Assess the conceptual originality. Provide a score from 0-100, a summary, and identify any potential conceptual overlaps with existing known work, if applicable.' : 'Originality check was not requested.'}
              4.  **Suggested Actions:** List 3-5 concrete, actionable steps the author can take to improve the project.
              5.  **Defense Preparation:** Generate a comprehensive set of at least 15 probing questions to prepare the author for a project defense (viva). Group these questions into 3-4 logical categories (e.g., Methodology & Approach, Contribution & Implications, Limitations & Future Work). For EACH question, you MUST provide a brief but insightful 'answerOutline' containing 2-3 bullet points that guide the author on how to structure their response.
              
              **Output Format:**
              You MUST return your entire analysis in a single, valid JSON object that adheres to the provided schema. The 'projectTitle' field is NOT in the schema; do not include it. Adhere strictly to the schema for all other fields. Do not include any markdown formatting or explanatory text outside of the JSON structure.
            `;
            
            const fileParts: Part[] = files.map(file => ({
                inlineData: { mimeType: file.type, data: file.content }
            }));

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-pro',
                contents: { parts: [{ text: prompt }, ...fileParts] },
                config: {
                    responseMimeType: "application/json",
                    responseSchema: createResponseSchema()
                }
            });
            
            const resultJson = response.text.trim();
            const resultData = JSON.parse(resultJson) as AnalysisResult;
            
            // Manually inject the user-provided title to ensure consistency.
            resultData.projectTitle = config.projectTitle;

            setAnalysisResult(resultData);
            saveReportToHistory(resultData);

        } catch (e) {
            console.error("Analysis failed:", e);
            setError(e instanceof Error ? e.message : "An unknown error occurred during analysis. The model may have returned an invalid response.");
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
            <main className="flex-1 flex flex-col h-screen transition-all duration-500 ease-in-out">
                 {!isConfigPanelOpen && (
                    <button 
                        onClick={() => setIsConfigPanelOpen(true)} 
                        className="hidden md:block fixed top-6 left-6 z-50 p-3 bg-[--background-secondary] rounded-full shadow-lg border border-[--border] hover:bg-[--background-tertiary] transition-colors"
                        aria-label="Open configuration panel"
                    >
                        <SliderIcon className="w-6 h-6" />
                    </button>
                )}
                <div className="md:hidden flex-shrink-0 p-4 border-b border-[--border] flex items-center">
                    <button onClick={() => setIsConfigPanelOpen(true)} className="p-2">
                        <SliderIcon className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold tracking-tight text-center flex-1">ASAP AI</h1>
                </div>
                <div className="flex-1 overflow-y-auto p-6 md:p-12">
                    {isAnalyzing ? <LoadingScreen /> : 
                     analysisResult ? <ResultsScreen result={analysisResult} projectTitle={config.projectTitle} /> : 
                     <WelcomeScreen error={error} />}
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