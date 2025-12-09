import React, { useState, useEffect } from 'react';
import { AnalysisResult, CriteriaAnalysis, OriginalityReport, DefensePrepQuestion, DefensePrepCategory } from '../types';
import { InfoIcon, FileTextIcon, CheckCircleIcon } from './icons';

interface ResultsScreenProps {
  result: AnalysisResult;
  projectTitle: string;
}

const ResultsScreen: React.FC<ResultsScreenProps> = ({ result, projectTitle }) => {
  const [activeView, setActiveView] = useState<'analysis' | 'viva'>('analysis');

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      
      {/* Header */}
      <header className="text-center space-y-3 pt-4">
        <span className="inline-block px-3 py-1 rounded-full bg-[--bg-secondary] text-[11px] font-semibold tracking-wider text-[--fg-secondary] uppercase">
            {result.projectTitle}
        </span>
        <h1 className="text-3xl md:text-5xl font-bold text-[--fg-primary] tracking-tight leading-tight">{result.summaryTitle}</h1>
        <div className="flex items-center justify-center gap-2 text-sm text-[--fg-secondary] font-medium">
             <span>{result.discipline}</span>
             <span className="w-1 h-1 rounded-full bg-[--fg-tertiary]"></span>
             <span>{result.academicLevel}</span>
        </div>
      </header>

      {/* Navigation Segmented Control */}
      <div className="flex justify-center">
        <div className="bg-[--bg-secondary] p-1 rounded-lg inline-flex relative">
            <button 
                onClick={() => setActiveView('analysis')}
                className={`relative z-10 px-8 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activeView === 'analysis' ? 'text-[--fg-primary] shadow-sm bg-[--bg-primary]' : 'text-[--fg-secondary] hover:text-[--fg-primary]'}`}
            >
                Overview
            </button>
            <button 
                onClick={() => setActiveView('viva')}
                className={`relative z-10 px-8 py-2 text-sm font-medium rounded-md transition-all duration-300 ${activeView === 'viva' ? 'text-[--fg-primary] shadow-sm bg-[--bg-primary]' : 'text-[--fg-secondary] hover:text-[--fg-primary]'}`}
            >
                Defense
            </button>
        </div>
      </div>

      <div key={activeView} className="animate-scale-up">
        {activeView === 'analysis' && <AnalysisView result={result} />}
        {activeView === 'viva' && <VivaView categories={result.defensePrep} />}
      </div>
    </div>
  );
};

const AnalysisView: React.FC<{ result: AnalysisResult }> = ({ result }) => (
    <div className="space-y-6">
        {/* Hero Card */}
        <div className="bg-[--bg-primary] border border-[--border] p-8 rounded-3xl shadow-sm flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="flex-shrink-0">
                 <ScoreGauge score={result.overallScore} size={140} strokeWidth={6} />
            </div>
            <div className="flex-1 text-center md:text-left">
                <h2 className="text-xl font-semibold text-[--fg-primary] mb-3">Assessment Summary</h2>
                <p className="text-[--fg-secondary] leading-relaxed">{result.overallAnalysis}</p>
            </div>
        </div>
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             {/* Criteria List */}
            <div className="bg-[--bg-primary] border border-[--border] p-6 rounded-3xl shadow-sm md:col-span-2">
                <h3 className="text-sm font-semibold text-[--fg-tertiary] uppercase tracking-wide mb-6">Performance Breakdown</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {result.criteriaAnalyses.map(criteria => <CriteriaCard key={criteria.name} criteria={criteria} />)}
                </div>
            </div>

            {/* Originality */}
            {result.originalityReport && (
                 <div className="bg-[--bg-primary] border border-[--border] p-6 rounded-3xl shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500"><FileTextIcon className="w-5 h-5"/></div>
                             <h3 className="font-semibold text-[--fg-primary]">Originality</h3>
                         </div>
                         <span className={`text-sm font-bold ${result.originalityReport.score > 80 ? 'text-[--success]' : 'text-[--warning]'}`}>
                             {result.originalityReport.score}/100
                         </span>
                    </div>
                    <p className="text-sm text-[--fg-secondary] mb-4">{result.originalityReport.summary}</p>
                    <div className="mt-auto space-y-3">
                        {result.originalityReport.findings.slice(0, 2).map((f, i) => (
                            <div key={i} className="text-xs bg-[--bg-secondary] p-3 rounded-xl">
                                <span className="font-medium text-[--fg-primary] block mb-0.5">{f.title}</span>
                                <span className="text-[--fg-tertiary]">{f.description}</span>
                            </div>
                        ))}
                    </div>
                 </div>
            )}

            {/* Actions */}
            <div className="bg-[--bg-primary] border border-[--border] p-6 rounded-3xl shadow-sm">
                <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-lg bg-[--accent]/10 text-[--accent]"><InfoIcon className="w-5 h-5"/></div>
                    <h3 className="font-semibold text-[--fg-primary]">Recommended Actions</h3>
                </div>
                <ul className="space-y-3">
                    {result.suggestedActions.map((item, i) => (
                        <li key={i} className="flex gap-3 text-sm text-[--fg-secondary]">
                            <CheckCircleIcon className="w-5 h-5 text-[--success] flex-shrink-0" />
                            <span>{item}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    </div>
);

const VivaView: React.FC<{ categories: DefensePrepCategory[] }> = ({ categories }) => (
    <div className="space-y-12">
        {categories.map((category, index) => (
            <div key={index}>
                <h2 className="text-xl font-bold text-[--fg-primary] mb-6 px-1">{category.categoryName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {category.questions.map((q, qIndex) => (
                        <Flashcard key={qIndex} question={q} />
                    ))}
                </div>
            </div>
        ))}
    </div>
);

const Flashcard: React.FC<{ question: DefensePrepQuestion }> = ({ question }) => {
    const [isFlipped, setIsFlipped] = useState(false);
    return (
        <div className="perspective-1000 h-64 group cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full preserve-3d transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-[--bg-primary] p-6 rounded-2xl border border-[--border] shadow-sm hover:shadow-md hover:border-[--accent]/30 transition-all flex flex-col justify-between">
                    <div>
                         <span className="text-[10px] font-bold text-[--fg-tertiary] uppercase tracking-wider mb-2 block">Question {question.number}</span>
                         <p className="font-medium text-[--fg-primary] leading-snug">{question.question}</p>
                    </div>
                    <div className="text-xs text-[--accent] font-medium text-center opacity-0 group-hover:opacity-100 transition-opacity">Show Hints</div>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[--bg-secondary] p-6 rounded-2xl border border-[--border] shadow-inner overflow-y-auto no-scrollbar">
                     <h3 className="text-xs font-bold text-[--fg-tertiary] uppercase mb-3">Key Points</h3>
                     <ul className="space-y-2">
                        {question.answerOutline?.map((point, i) => (
                            <li key={i} className="text-xs text-[--fg-secondary] leading-relaxed flex gap-2">
                                <span className="w-1 h-1 rounded-full bg-[--accent] mt-1.5 flex-shrink-0"></span>
                                {point}
                            </li>
                        ))}
                     </ul>
                </div>
            </div>
        </div>
    );
};

const ScoreGauge: React.FC<{score: number, size?: number, strokeWidth?: number}> = ({ score, size = 80, strokeWidth = 8 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const [offset, setOffset] = useState(circumference);
    
    useEffect(() => {
        const progress = score / 100;
        setOffset(circumference * (1 - progress));
    }, [score, circumference]);

    const color = score > 80 ? 'text-[--success]' : score > 60 ? 'text-[--warning]' : 'text-[--danger]';

    return (
        <div className="relative flex-shrink-0" style={{width: size, height: size}}>
            <svg className="w-full h-full transform -rotate-90">
                <circle className="text-[--bg-tertiary]" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size/2} cy={size/2} />
                <circle className={`${color} transition-all duration-1000 ease-out`} stroke="currentColor" strokeWidth={strokeWidth} strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" fill="transparent" r={radius} cx={size/2} cy={size/2} />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-bold text-[--fg-primary] tracking-tight" style={{ fontSize: size / 3.5 }}>{score}</span>
            </div>
        </div>
    );
}

const CriteriaCard: React.FC<{ criteria: CriteriaAnalysis }> = ({ criteria }) => (
    <div className="bg-[--bg-secondary]/50 p-4 rounded-xl border border-[--border] hover:bg-[--bg-secondary] transition-colors">
        <div className="flex justify-between items-start mb-3">
            <h4 className="font-semibold text-sm text-[--fg-primary]">{criteria.name}</h4>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${criteria.score > 75 ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                {criteria.score}
            </span>
        </div>
        <ul className="space-y-2">
            {criteria.points.slice(0, 2).map((point, i) => (
                <li key={i} className="text-xs text-[--fg-secondary] leading-relaxed flex gap-2">
                    <span className="w-1 h-1 rounded-full bg-[--fg-tertiary] mt-1.5 flex-shrink-0"></span>
                    {point}
                </li>
            ))}
        </ul>
    </div>
);

export default ResultsScreen;