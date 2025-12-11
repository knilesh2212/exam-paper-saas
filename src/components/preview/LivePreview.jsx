import React from 'react';
import { PDFViewer as ReactPDFViewer } from '@react-pdf/renderer'; // Renamed to avoid recursion if I named component same
import { PDFDocument } from './PDFDocument';
import { useExam } from '@/context/ExamContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Download } from 'lucide-react';
import { PDFDownloadLink } from '@react-pdf/renderer';

const LivePreview = ({ onBack }) => {
    const { examMeta, questions, styles, sections } = useExam();

    return (
        <div className="h-full w-full flex flex-col bg-slate-100 dark:bg-slate-900 border-l animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-white dark:bg-slate-800 border-b p-2 flex justify-between items-center px-4 h-14 shrink-0 shadow-sm z-10">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" onClick={onBack} size="sm" className="gap-1">
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
                            <Button disabled={loading} className="gap-2" size="sm">
                                <Download className="h-4 w-4" />
                                {loading ? 'Preparing...' : 'Download PDF'}
                            </Button>
                        )}
                    </PDFDownloadLink>
                </div>
            </div>

            <div className="flex-grow overflow-hidden relative bg-slate-200/50 p-4 md:p-8 flex justify-center">
                <div className="shadow-2xl h-full w-full max-w-4xl">
                    <ReactPDFViewer
                        className="w-full h-full border-none rounded-lg"
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
