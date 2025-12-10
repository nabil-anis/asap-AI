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
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in">
      <header className="text-center">
        <p className="text-sm font-medium text-[--foreground-secondary] uppercase tracking-wider">{result.projectTitle}</p>
        <h1 className="text-3xl md:text-4xl font-bold text-[--foreground] tracking-tight mt-1">{result.summaryTitle}</h1>
      </header>

      <div className="flex justify-center">
        <SegmentedControl
            activeValue={activeView}
            onValueChange={(value) => setActiveView(value as 'viva' | 'analysis')}
            options={[
                { label: "Analysis", value: "analysis" },
                { label: "Defense Prep", value: "viva" }
            ]}
        />
      </div>

      <div key={activeView} className="animate-fade-in">
        {activeView === 'analysis' && <AnalysisView result={result} />}
        {activeView === 'viva' && <VivaView categories={result.defensePrep} />}
      </div>
    </div>
  );
};

const SegmentedControl: React.FC<{ options: {label: string, value: string}[], activeValue: string, onValueChange: (value: string) => void }> = ({ options, activeValue, onValueChange }) => (
    <div className="p-1 bg-[--input] rounded-xl flex items-center space-x-1">
        {options.map(opt => (
            <button key={opt.value} onClick={() => onValueChange(opt.value)} className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeValue === opt.value ? 'bg-[--background] shadow-sm text-[--foreground]' : 'text-[--foreground-secondary] hover:bg-[--background-tertiary]/50'}`}>
                {opt.label}
            </button>
        ))}
    </div>
)

const AnalysisView: React.FC<{ result: AnalysisResult }> = ({ result }) => (
    <div className="space-y-8">
        <div className="bg-[--background-secondary] border border-[--border] p-6 rounded-3xl flex flex-col md:flex-row items-center gap-8">
            <ScoreGauge score={result.overallScore} size={160} strokeWidth={12} />
            <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-[--foreground]">{result.summaryTitle}</h2>
                <p className="text-[--foreground-secondary] mt-1">{result.discipline} &middot; {result.academicLevel}</p>
                 <p className="mt-4 text-sm text-[--foreground-secondary] leading-relaxed max-w-2xl">{result.overallAnalysis}</p>
            </div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {result.criteriaAnalyses.map(criteria => <CriteriaCard key={criteria.name} criteria={criteria} />)}
        </div>
        
        {result.originalityReport && result.originalityReport.score > 0 && <OriginalityCard report={result.originalityReport} />}

        <InfoCard title="Suggested Actions" list={result.suggestedActions} icon={<InfoIcon/>} />
    </div>
);

const VivaView: React.FC<{ categories: DefensePrepCategory[] }> = ({ categories }) => (
    <div className="space-y-12">
        {categories.map((category, index) => (
            <div key={index}>
                <h2 className="text-xl font-bold text-[--foreground] mb-4 border-b border-[--border] pb-2">{category.categoryName}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="perspective-1000 h-64" onClick={() => setIsFlipped(!isFlipped)}>
            <div className={`relative w-full h-full preserve-3d transition-transform duration-500 ${isFlipped ? 'rotate-y-180' : ''}`}>
                {/* Front */}
                <div className="absolute w-full h-full backface-hidden bg-[--background-secondary] p-6 rounded-3xl border border-[--border] flex flex-col justify-start gap-4 cursor-pointer overflow-y-auto no-scrollbar">
                    <h3 className="font-semibold text-sm text-[--accent] flex-shrink-0">Question {question.number}</h3>
                    <p className="text-[--foreground] text-left text-base leading-relaxed">{question.question}</p>
                </div>
                {/* Back */}
                <div className="absolute w-full h-full backface-hidden rotate-y-180 bg-[--accent]/5 p-6 rounded-3xl border border-[--accent]/20 flex flex-col justify-start cursor-pointer overflow-y-auto no-scrollbar">
                     <h3 className="font-semibold text-sm text-[--accent]">Answer Outline</h3>
                     {question.answerOutline && question.answerOutline.length > 0 ? (
                        <ul className="mt-3 space-y-2 text-xs text-[--foreground-secondary] list-disc pl-4">
                            {question.answerOutline.map((point, i) => <li key={i}>{point}</li>)}
                        </ul>
                     ) : (
                        <p className="mt-3 text-xs text-[--foreground-secondary]">No specific points provided. Focus on a comprehensive answer.</p>
                     )}
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
        const newOffset = circumference * (1 - progress);
        setTimeout(() => setOffset(newOffset), 100); 
    }, [score, circumference]);

    const scoreColorClass = score > 80 ? 'text-[--score-high]' : score > 60 ? 'text-[--score-medium]' : 'text-[--score-low]';

    return (
        <div className="relative flex-shrink-0" style={{width: size, height: size}}>
            <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
                <circle className="text-[--border]" stroke="currentColor" strokeWidth={strokeWidth} fill="transparent" r={radius} cx={size/2} cy={size/2}/>
                <circle
                    className={`${scoreColorClass} transition-all duration-1000 ease-out`}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    fill="transparent"
                    r={radius}
                    cx={size/2}
                    cy={size/2}
                    style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                />
            </svg>
            <span className={`absolute inset-0 flex items-center justify-center font-bold tracking-tighter ${scoreColorClass}`} style={{ fontSize: size / 4 }}>
                <span className="flex items-baseline">
                    {score}
                    <span className="text-[0.6em] font-semibold ml-0.5">%</span>
                </span>
            </span>
        </div>
    );
}

const CriteriaCard: React.FC<{ criteria: CriteriaAnalysis }> = ({ criteria }) => (
    <div className="bg-[--background-secondary] border border-[--border] p-6 rounded-3xl">
        <div className="flex justify-between items-start">
            <h3 className="font-semibold text-[--foreground] pr-2">{criteria.name}</h3>
            <ScoreGauge score={criteria.score} size={50} strokeWidth={5} />
        </div>
        <ul className="mt-4 space-y-2.5 text-sm text-[--foreground-secondary] list-disc pl-4">
            {criteria.points.map((point, i) => <li key={i}>{point}</li>)}
        </ul>
    </div>
);

const OriginalityCard: React.FC<{ report: OriginalityReport }> = ({ report }) => (
    <div className="bg-[--background-secondary] border border-[--border] p-6 rounded-3xl">
       <div className="flex items-start gap-6">
           <div className="flex-shrink-0">
                <h3 className="font-semibold flex items-center gap-2 text-[--foreground] mb-4"><FileTextIcon className="w-5 h-5 text-[--accent]" /> Originality Report</h3>
                <ScoreGauge score={report.score} size={80} strokeWidth={8} />
           </div>
           <div>
                <h4 className="font-semibold text-[--foreground]">Summary</h4>
                <p className="mt-1 text-sm text-[--foreground-secondary]">{report.summary}</p>
           </div>
       </div>
       {report.findings.length > 0 && (
         <div className="mt-6 border-t border-[--border] pt-6">
             <h4 className="font-semibold text-[--foreground]">Potential Findings</h4>
             <div className="mt-3 space-y-4">
                 {report.findings.map((finding, i) => (
                     <div key={i} className="text-sm">
                         <p className="font-medium text-[--foreground]">{finding.title}</p>
                         <p className="text-[--foreground-secondary]">{finding.description}</p>
                     </div>
                 ))}
             </div>
         </div>
       )}
    </div>
);

const InfoCard: React.FC<{ title: string, content?: string, list?: string[], icon: React.ReactElement<{ className?: string }> }> = ({ title, content, list, icon }) => (
    <div className="bg-[--background-secondary] border border-[--border] p-6 rounded-3xl">
        <h3 className="font-semibold flex items-center gap-2 text-[--foreground]">{React.cloneElement(icon, { className: 'w-5 h-5 text-[--accent]' })} {title}</h3>
        {content && <p className="mt-4 text-sm text-[--foreground-secondary] leading-relaxed">{content}</p>}
        {list && (
            <ul className="mt-4 space-y-3 text-sm">
                {list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                        <span className="flex-shrink-0 mt-0.5 w-4 h-4 text-[--score-high]">
                            <CheckCircleIcon className="w-full h-full" />
                        </span>
                        <span className="text-[--foreground-secondary]">{item}</span>
                    </li>
                ))}
            </ul>
        )}
    </div>
);

export default ResultsScreen;