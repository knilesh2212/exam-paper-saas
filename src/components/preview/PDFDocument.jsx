import React from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

// Register fonts if needed (standard fonts like Helvetica depend on library)
// Font.register({ family: 'Roboto', src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf' });

const styles = StyleSheet.create({
    page: {
        padding: 40,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
    },
    header: {
        marginBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#000',
        paddingBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center', // Center align if no logo, or space-between if logo
    },
    headerLeft: {
        flex: 1,
    },
    headerCenter: {
        textAlign: 'center',
        alignItems: 'center',
        flex: 2,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
        fontSize: 10,
    },
    institutionName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
        textTransform: 'uppercase',
    },
    examTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 2,
    },
    metaRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginTop: 15,
        marginBottom: 5,
        fontSize: 10,
    },
    instructionsBox: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 8,
        marginBottom: 20,
    },
    instructionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        textDecoration: 'underline',
    },
    instructionItem: {
        fontSize: 10,
        marginBottom: 2,
    },
    sectionContainer: {
        marginBottom: 15,
        width: '100%',
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 8,
        textTransform: 'uppercase',
        backgroundColor: '#f0f0f0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        width: '100%',
    },
    sectionData: {
        marginBottom: 10,
    },
    sectionReview: {
        fontSize: 10,
        fontStyle: 'italic',
        marginBottom: 5,
    },
    questionContainer: {
        marginBottom: 30,
        flexDirection: 'row',
    },
    questionNum: {
        width: 25,
        fontWeight: 'bold',
    },
    questionContent: {
        flex: 1,
    },
    questionText: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    marks: {
        fontWeight: 'bold',
        fontSize: 10,
    },
    optionsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 2,
    },
    optionItem: {
        width: '50%',
        marginBottom: 2,
    },
    answerSpace: {
        marginTop: 20,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderBottomStyle: 'dashed',
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 40,
        right: 40,
        textAlign: 'center',
        fontSize: 9,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
        paddingTop: 5,
    },
});

export const PDFDocument = ({ examMeta, questions, styles: examStyles, sections }) => {
    // Helper to get questions for a section
    const getSectionQuestions = (sectionId) => {
        if (!sections || sections.length === 0) return questions;
        return questions.filter(q => (q.sectionId === sectionId) || (!q.sectionId && sectionId === sections[0].id));
    };

    // Calculate global question index to keep numbering continuous across sections? 
    // Usually exams number continuously (1, 2, 3...) regardless of section.
    // Or restart per section? Let's assume continuous for now.
    let questionCounter = 0;

    return (
        <Document>
            <Page size={examStyles.paperSize || 'A4'} style={styles.page}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerCenter}>
                        <Text style={styles.institutionName}>{examMeta.institutionName || 'INSTITUTION NAME'}</Text>
                        <Text style={styles.examTitle}>
                            {examMeta.subject ? `${examMeta.subject}` : 'SUBJECT'}
                            {examMeta.grade ? ` - ${examMeta.grade}` : ''}
                        </Text>
                    </View>
                </View>

                {/* Meta Info */}
                <View style={styles.metaRow}>
                    <Text>Date: {examMeta.date}</Text>
                    <Text>Duration: {examMeta.duration} mins</Text>
                    <Text>Total Marks: {examMeta.totalMarks}</Text>
                </View>

                {/* Student Fields */}
                <View style={{ marginTop: 10, marginBottom: 20, gap: 5 }}>
                    <Text>Name: __________________________________________   Roll No: __________________</Text>
                </View>

                {/* Instructions */}
                {examMeta.instructions && examMeta.instructions.length > 0 && examMeta.instructions[0] && (
                    <View style={styles.instructionsBox}>
                        <Text style={styles.instructionTitle}>General Instructions:</Text>
                        {examMeta.instructions.map((inst, index) => (
                            inst ? <Text key={index} style={styles.instructionItem}>{index + 1}. {inst}</Text> : null
                        ))}
                    </View>
                )}

                {/* Content */}
                {(!sections || sections.length === 0) ? (
                    // Fallback for no sections (legacy support or empty)
                    getSectionQuestions(null).map((q, index) => {
                        questionCounter++;
                        return (
                            <QuestionItem
                                key={q.id}
                                q={q}
                                index={questionCounter - 1}
                                styles={styles}
                                examStyles={examStyles}
                            />
                        )
                    })
                ) : (
                    sections.map((section) => {
                        const sectionQuestions = getSectionQuestions(section.id);
                        if (sectionQuestions.length === 0) return null;

                        return (
                            <View key={section.id} style={styles.sectionContainer} wrap={false}>
                                {/* wrap=false prevents section header being orphaned, but might cause large empty spaces if section is long. 
                                    Better to let it break but keep header with at least one question? React-PDF doesn't support 'orphans' well yet. 
                                    Let's allow wrap for the container, but maybe keep header distinct.
                                */}
                                <Text style={styles.sectionHeader}>{section.title}</Text>
                                {section.instructions && (
                                    <Text style={[styles.instructionItem, { marginBottom: 10, fontStyle: 'italic' }]}>{section.instructions}</Text>
                                )}

                                {sectionQuestions.map((q) => {
                                    questionCounter++;
                                    return (
                                        <QuestionItem
                                            key={q.id}
                                            q={q}
                                            index={questionCounter - 1}
                                            styles={styles}
                                            examStyles={examStyles}
                                        />
                                    );
                                })}
                            </View>
                        );
                    })
                )}

                {/* Footer */}
                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `${pageNumber} / ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

const QuestionItem = ({ q, index, styles, examStyles }) => (
    <View style={styles.questionContainer} wrap={false}>
        <Text style={styles.questionNum}>{index + 1}.</Text>
        <View style={styles.questionContent}>
            <Text style={styles.questionText}>
                {q.questionText}
                {examStyles.showMarks && <Text style={styles.marks}> [{q.marks}]</Text>}
            </Text>

            {/* Render Options if MCQ */}
            {q.type === 'mcq' && q.options && (
                <View style={styles.optionsGrid}>
                    {q.options.map((opt, i) => (
                        <View key={i} style={styles.optionItem}>
                            <Text>({String.fromCharCode(97 + i)}) {opt}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Answer Space */}
            {examStyles.showLines && q.type !== 'mcq' && (
                <View style={{ height: 40 }}></View>
            )}
        </View>
    </View>
);
