import React from 'react';
import { Page, Text, View, Document, StyleSheet, Font } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        paddingTop: 40,
        paddingBottom: 40,
        paddingLeft: 50,
        paddingRight: 50,
        fontFamily: 'Helvetica',
        fontSize: 11,
        lineHeight: 1.5,
    },
    // Header Section
    headerContainer: {
        marginBottom: 20,
        borderBottomWidth: 1.5,
        borderBottomColor: '#000',
        paddingBottom: 10,
        flexDirection: 'column',
        alignItems: 'center',
    },
    institutionName: {
        fontSize: 18,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 4,
        textAlign: 'center',
    },
    examDetails: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 2,
        textAlign: 'center',
    },
    // Meta Info Row
    metaInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
        fontSize: 10,
        fontWeight: 'bold',
    },
    // Student Input Area
    studentInputContainer: {
        marginTop: 5,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: 10,
    },
    // Instructions
    instructionsContainer: {
        borderWidth: 1,
        borderColor: '#000',
        padding: 8,
        marginBottom: 20,
        backgroundColor: '#f9f9f9',
    },
    instructionTitle: {
        fontSize: 10,
        fontWeight: 'bold',
        marginBottom: 4,
        textDecoration: 'underline',
    },
    instructionText: {
        fontSize: 10,
        marginBottom: 2,
    },
    // Sections
    sectionContainer: {
        marginBottom: 10,
    },
    sectionHeader: {
        fontSize: 12,
        fontWeight: 'bold',
        marginTop: 10,
        marginBottom: 10,
        textTransform: 'uppercase',
        backgroundColor: '#e0e0e0',
        paddingVertical: 4,
        paddingHorizontal: 8,
        textAlign: 'center',
    },
    sectionSubtext: {
        fontSize: 10,
        fontStyle: 'italic',
        marginBottom: 10,
        textAlign: 'center',
    },
    // Question Item Layout (Grid like)
    questionRow: {
        flexDirection: 'row',
        marginBottom: 12,
        alignItems: 'flex-start',
    },
    qNumCol: {
        width: 30, // Fixed width for number
        fontSize: 11,
        fontWeight: 'bold',
    },
    qContentCol: {
        flex: 1,
        marginRight: 10,
    },
    qMarksCol: {
        width: 35, // Fixed width for marks
        alignItems: 'flex-end',
    },
    questionText: {
        fontSize: 11,
        textAlign: 'justify',
        marginBottom: 4,
    },
    marksText: {
        fontSize: 10,
        fontWeight: 'bold',
    },
    // MCQ Options
    optionsContainer: {
        marginTop: 4,
        flexDirection: 'column',
    },
    optionRow: {
        flexDirection: 'row',
        marginBottom: 2,
    },
    optionLabel: {
        width: 20,
        fontWeight: 'bold',
        fontSize: 11,
    },
    optionText: {
        fontSize: 11,
        flex: 1,
    },
    // Answer Lines
    answerLines: {
        marginTop: 30,
        marginBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        borderBottomStyle: 'dotted',
    },
    // Footer
    footer: {
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        textAlign: 'center',
        fontSize: 9,
        color: '#666',
    },
});

export const PDFDocument = ({ examMeta, questions, styles: examStyles, sections }) => {

    const getSectionQuestions = (sectionId) => {
        if (!sections || sections.length === 0) return questions;
        return questions.filter(q => (q.sectionId === sectionId) || (!q.sectionId && sectionId === sections[0].id));
    };

    let questionCounter = 0;

    return (
        <Document>
            <Page size={examStyles.paperSize || 'A4'} style={styles.page}>

                {/* 1. Header */}
                <View style={styles.headerContainer}>
                    <Text style={styles.institutionName}>{examMeta.institutionName || 'INSTITUTION NAME'}</Text>
                    <Text style={styles.examDetails}>
                        {examMeta.subject ? `${examMeta.subject}` : 'SUBJECT'}
                        {examMeta.grade ? ` | ${examMeta.grade}` : ''}
                    </Text>
                    <Text style={{ fontSize: 10, marginTop: 4 }}>
                        {examMeta.term ? `${examMeta.term}` : ''}
                    </Text>
                </View>

                {/* 2. Meta Info */}
                <View style={styles.metaInfoContainer}>
                    <Text>Time: {examMeta.duration} mins</Text>
                    <Text>Date: {examMeta.date}</Text>
                    <Text>Max Marks: {examMeta.totalMarks}</Text>
                </View>

                {/* 3. Student Fields */}
                <View style={styles.studentInputContainer}>
                    <Text>Student Name: _________________________________</Text>
                    <Text>Roll No: ________________</Text>
                </View>

                {/* 4. Instructions */}
                {examMeta.instructions && examMeta.instructions.length > 0 && examMeta.instructions[0] && (
                    <View style={styles.instructionsContainer}>
                        <Text style={styles.instructionTitle}>INSTRUCTIONS:</Text>
                        {examMeta.instructions.map((inst, index) => (
                            inst ? <Text key={index} style={styles.instructionText}>{index + 1}. {inst}</Text> : null
                        ))}
                    </View>
                )}

                {/* 5. Questions Content */}
                {(!sections || sections.length === 0) ? (
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
                            <View key={section.id} style={styles.sectionContainer}>
                                <Text style={styles.sectionHeader}>{section.title}</Text>
                                {section.instructions && (
                                    <Text style={styles.sectionSubtext}>{section.instructions}</Text>
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

                {/* 6. Footer */}
                <Text style={styles.footer} render={({ pageNumber, totalPages }) => (
                    `Page ${pageNumber} of ${totalPages}`
                )} fixed />
            </Page>
        </Document>
    );
};

const QuestionItem = ({ q, index, styles, examStyles }) => (
    <View style={styles.questionRow} wrap={false}>
        {/* Column 1: Number */}
        <View style={styles.qNumCol}>
            <Text>{index + 1}.</Text>
        </View>

        {/* Column 2: Content */}
        <View style={styles.qContentCol}>
            <Text style={styles.questionText}>{q.questionText}</Text>

            {/* MCQ Options */}
            {q.type === 'mcq' && q.options && (
                <View style={styles.optionsContainer}>
                    {q.options.map((opt, i) => (
                        <View key={i} style={styles.optionRow}>
                            <Text style={styles.optionLabel}>({String.fromCharCode(97 + i)})</Text>
                            <Text style={styles.optionText}>{opt}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Answer Lines (only if enabled and not MCQ) */}
            {examStyles.showLines && q.type !== 'mcq' && (
                <View style={{ height: 40 }}></View>
            )}
        </View>

        {/* Column 3: Marks */}
        {examStyles.showMarks && (
            <View style={styles.qMarksCol}>
                <Text style={styles.marksText}>[{q.marks}]</Text>
            </View>
        )}
    </View>
);
