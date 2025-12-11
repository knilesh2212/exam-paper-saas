import React from 'react';
import { PDFViewer as ReactPDFViewer } from '@react-pdf/renderer';
import { PDFDocument } from './PDFDocument';
import { useExam } from '@/context/ExamContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';

const LivePreview = ({ onBack }) => {
    const { examMeta, questions, styles, sections } = useExam();

    return (
        <div className="h-full w-full flex flex-col bg-slate-100 dark:bg-slate-900 animate-in fade-in slide-in-from-right-4 duration-500">
            {/* Header Toolbar */}
            <div className="bg-white dark:bg-slate-800 border-b p-4 flex justify-between items-center shadow-sm z-10 shrink-0">
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={onBack} size="sm" className="gap-2">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Layout
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <PDFDownloadLink
                        document={<PDFDocument examMeta={examMeta} questions={questions} styles={styles} sections={sections} />}
                        fileName={`${examMeta.subject || 'Exam'}_${examMeta.date}.pdf`}
                    >
                        {({ blob, url, loading, error }) => (
                            <Button disabled={loading} className="gap-2 shadow-sm" size="sm">
                                <Download className="h-4 w-4" />
                                {loading ? 'Preparing PDF...' : 'Download PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            {/* PDF Viewer Container */}
            <div className="flex-grow overflow-hidden relative bg-slate-200/50 dark:bg-slate-950/50 p-4 md:p-8 flex justify-center">
                <div className="shadow-2xl h-full w-full max-w-5xl rounded-lg overflow-hidden bg-white">
                    <ReactPDFViewer
                        className="w-full h-full border-none"
                        showToolbar={true}
                    >
                        <PDFDocument
                            examMeta={examMeta}
                            questions={questions}
                            styles={styles}
                            sections={sections}
                        />
                    </ReactPDFViewer>
                </div>
            </div>
        </div>
    );
};

export default LivePreview;
