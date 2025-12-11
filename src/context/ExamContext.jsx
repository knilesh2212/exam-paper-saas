import React, { createContext, useContext } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

const ExamContext = createContext();

export const useExam = () => useContext(ExamContext);

const startOfToday = new Date().toISOString().split('T')[0];

const defaultMeta = {
    institutionName: '',
    logo: null, // We'll store this as base64 string or URL
    subject: '',
    grade: '',
    totalMarks: 100,
    duration: 60, // minutes
    date: startOfToday,
    instructions: ['All questions are compulsory.', 'Read questions carefully before answering.'],
};

const defaultStyles = {
    paperSize: 'A4',
    orientation: 'portrait',
    fontFamily: 'Times New Roman',
    fontSize: '12',
    columns: 1,
    showMarks: true,
    showLines: true,
};

export const ExamProvider = ({ children }) => {
    const [examMeta, setExamMeta] = useLocalStorage('exam_meta', defaultMeta);
    const [questions, setQuestions] = useLocalStorage('exam_questions', []);
    const [styles, setStyles] = useLocalStorage('exam_styles', defaultStyles);

    const [sections, setSections] = useLocalStorage('exam_sections', [
        { id: 'default', title: 'Section A', instructions: 'Attempt all questions in this section.' }
    ]);

    const updateExamMeta = (updates) => {
        setExamMeta((prev) => ({ ...prev, ...updates }));
    };

    const addSection = () => {
        const newSection = {
            id: crypto.randomUUID(),
            title: `Section ${String.fromCharCode(65 + sections.length)}`,
            instructions: ''
        };
        setSections(prev => [...prev, newSection]);
    };

    const updateSection = (id, updates) => {
        setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const deleteSection = (id) => {
        if (sections.length <= 1) return; // Prevent deleting the last section
        setSections(prev => prev.filter(s => s.id !== id));
        // Move questions from deleted section to the first available section
        const fallbackSectionId = sections.find(s => s.id !== id)?.id;
        if (fallbackSectionId) {
            setQuestions(prev => prev.map(q => q.sectionId === id ? { ...q, sectionId: fallbackSectionId } : q));
        }
    };

    const addQuestion = (question, sectionId) => {
        const targetSectionId = sectionId || sections[0].id;
        const newQuestion = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            sectionId: targetSectionId,
            ...question,
        };
        setQuestions((prev) => [...prev, newQuestion]);
    };

    const updateQuestion = (id, updates) => {
        setQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, ...updates } : q))
        );
    };

    const deleteQuestion = (id) => {
        setQuestions((prev) => prev.filter((q) => q.id !== id));
    };

    const duplicateQuestion = (id) => {
        const qToDup = questions.find(q => q.id === id);
        if (qToDup) {
            addQuestion({ ...qToDup, id: undefined }, qToDup.sectionId); // Pass sectionId to duplicate in same section
        }
    }

    const reorderQuestions = (newOrder) => {
        setQuestions(newOrder);
    };

    const updateStyles = (updates) => {
        setStyles((prev) => ({ ...prev, ...updates }));
    };

    const resetExam = () => {
        if (confirm("Are you sure you want to create a new exam? Current unsaved work will be lost if not exported.")) {
            setExamMeta(defaultMeta);
            setQuestions([]);
            setStyles(defaultStyles);
            setSections([{ id: 'default', title: 'Section A', instructions: 'Attempt all questions in this section.' }]);
        }
    }

    // Computed stats
    const currentTotalMarks = questions.reduce((sum, q) => sum + (Number(q.marks) || 0), 0);

    return (
        <ExamContext.Provider
            value={{
                examMeta,
                questions,
                styles,
                sections,
                updateExamMeta,
                addSection,
                updateSection,
                deleteSection,
                addQuestion,
                updateQuestion,
                deleteQuestion,
                duplicateQuestion,
                reorderQuestions,
                updateStyles,
                resetExam,
                currentTotalMarks
            }}
        >
            {children}
        </ExamContext.Provider>
    );
};
