import React from 'react';
import { 
    FinanceIcon, ComputerScienceIcon, EngineeringIcon, BiologyIcon, LiteratureIcon, HistoryDisciplineIcon, ArtIcon, 
    PhysicsIcon, PharmacyIcon, LawIcon, GeneralIcon, ManagementIcon, EntrepreneurshipIcon, OtherIcon 
} from './components/icons';

export const MIN_CRITERIA = 3;
export const MAX_CRITERIA = 7;
export const MAX_TOTAL_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

export const DISCIPLINES = {
  'Finance': {
    name: 'Finance',
    icon: FinanceIcon,
    criteria: ['Quantitative Analysis', 'Market Understanding', 'Risk Assessment', 'Model Validity'],
    uploadHint: 'Recommended: CSV, XLSX, PDF reports, DOCX analysis.',
  },
  'Computer Science': {
    name: 'Computer Science',
    icon: ComputerScienceIcon,
    criteria: ['Algorithm Efficiency', 'Code Quality & Style', 'System Architecture', 'Problem Solving'],
    uploadHint: 'Recommended: Code files (.py, .js, .java), Markdown (.md), PDF design docs.',
  },
  'Electrical Engineering': {
    name: 'Electrical Engineering',
    icon: EngineeringIcon,
    criteria: ['Circuit Design', 'Signal Processing', 'System Integration', 'Prototyping Quality'],
    uploadHint: 'Recommended: PDF schematics, simulation data (CSV), DOCX reports.',
  },
  'Management': {
    name: 'Management',
    icon: ManagementIcon,
    criteria: ['Strategic Analysis', 'Operational Efficiency', 'Leadership & Decision Making', 'Market Positioning'],
    uploadHint: 'Recommended: DOCX strategy docs, PPTX presentations, XLSX data sheets.',
  },
  'Entrepreneurship': {
    name: 'Entrepreneurship',
    icon: EntrepreneurshipIcon,
    criteria: ['Innovation & Viability', 'Business Model', 'Market Execution Plan', 'Scalability'],
    uploadHint: 'Recommended: PDF business plan, PPTX pitch deck, XLSX financial models.',
  },
  'Biology': {
    name: 'Biology',
    icon: BiologyIcon,
    criteria: ['Methodology', 'Data Interpretation', 'Contribution to Field', 'Ethical Considerations'],
    uploadHint: 'Recommended: PDF research papers, DOCX lab reports, CSV datasets.',
  },
  'Literature': {
    name: 'Literature',
    icon: LiteratureIcon,
    criteria: ['Thesis Strength', 'Textual Evidence', 'Critical Analysis', 'Prose & Style'],
    uploadHint: 'Recommended: DOCX essays, PDF articles, TXT manuscripts.',
  },
  'History': {
    name: 'History',
    icon: HistoryDisciplineIcon,
    criteria: ['Argument Strength', 'Primary Source Use', 'Historiographical Awareness', 'Narrative Cohesion'],
    uploadHint: 'Recommended: DOCX papers, PDF primary sources, research notes.',
  },
  'Art': {
    name: 'Art',
    icon: ArtIcon,
    criteria: ['Conceptual Strength', 'Technical Execution', 'Originality', 'Artist Statement Clarity'],
    uploadHint: 'Recommended: High-res images (JPG, PNG), PDF artist statement.',
  },
  'Physics': {
    name: 'Physics',
    icon: PhysicsIcon,
    criteria: ['Theoretical Soundness', 'Experimental Design', 'Data Analysis', 'Conclusion Validity'],
    uploadHint: 'Recommended: PDF papers, LaTeX source files (.tex), CSV experimental data.',
  },
  'Pharmacy': {
    name: 'Pharmacy',
    icon: PharmacyIcon,
    criteria: ['Pharmacological Knowledge', 'Clinical Application', 'Patient Safety', 'Regulatory Adherence'],
    uploadHint: 'Recommended: PDF case studies, DOCX reports, PPTX presentations.',
  },
  'Law': {
    name: 'Law',
    icon: LawIcon,
    criteria: ['Legal Reasoning', 'Case Law Application', 'Statutory Interpretation', 'Argument Structure'],
    uploadHint: 'Recommended: PDF legal briefs, DOCX memos, case files.',
  },
   'General': {
    name: 'General',
    icon: GeneralIcon,
    criteria: ['Clarity & Structure', 'Depth of Research', 'Originality', 'Critical Analysis'],
    uploadHint: 'Recommended: DOCX, PDF, PPTX, TXT files.',
  },
  'Other': {
    name: 'Other',
    icon: OtherIcon,
    criteria: ['Clarity & Structure', 'Depth of Research', 'Originality', 'Critical Analysis'],
    uploadHint: 'Upload relevant documents for your field (PDF, DOCX, etc.).',
  },
};

export const ACADEMIC_LEVELS = [
  'Undergraduate (Year 1-2)',
  'Undergraduate (Year 3-4)',
  'Masters',
  'PhD',
  'Professional Development',
];