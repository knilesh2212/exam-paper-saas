import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { PlusCircle, FileText, History, Layout, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useExam } from '@/context/ExamContext';

const Dashboard = () => {
    const { resetExam, questions } = useExam();

    return (
        <div className="min-h-screen bg-slate-50/50 dark:bg-slate-900/50">
            <Navbar />
            <main className="container mx-auto p-6 md:p-8 max-w-7xl">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-2">Manage your exam papers and templates.</p>
                </header>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Create New Card */}
                    <Card className="hover:shadow-lg transition-all duration-200 border-primary/20 bg-gradient-to-br from-white to-blue-50/20 dark:from-slate-800 dark:to-slate-800/50 overflow-hidden relative group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                            <FileText className="w-24 h-24 text-primary transform rotate-12 translate-x-4 -translate-y-4" />
                        </div>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-xl">
                                <PlusCircle className="h-5 w-5 text-primary" />
                                Create New Exam
                            </CardTitle>
                            <CardDescription>Start designing a new question paper from scratch.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 pb-8">
                            <div className="flex gap-2">
                                <div className="h-2 w-2 rounded-full bg-primary/20"></div>
                                <div className="h-2 w-2 rounded-full bg-primary/40"></div>
                                <div className="h-2 w-2 rounded-full bg-primary/60"></div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full gap-2 group-hover:bg-primary/90 transition-colors" size="lg" asChild onClick={resetExam}>
                                <Link to="/create">
                                    Start Creating
                                    <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Quick Resume Card - Show if drafts exist (mock logic for now, using current questions length) */}
                    {questions.length > 0 && (
                        <Card className="bg-white dark:bg-slate-800 border-l-4 border-l-orange-500">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <History className="h-5 w-5 text-orange-500" />
                                    Continue Draft
                                </CardTitle>
                                <CardDescription>You have an unsaved exam in progress.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="text-sm font-medium">Unsaved Exam</div>
                                    <div className="text-xs text-slate-500">{questions.length} questions added</div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="secondary" className="w-full" asChild>
                                    <Link to="/create">Resume Editing</Link>
                                </Button>
                            </CardFooter>
                        </Card>
                    )}

                    {/* Templates Card (Coming Soon) */}
                    <Card className="bg-white dark:bg-slate-800 opacity-80">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Layout className="h-5 w-5" />
                                Templates
                            </CardTitle>
                            <CardDescription>Use pre-defined layouts for quick setup.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col items-center justify-center p-4 text-center space-y-2">
                                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">Coming Soon</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" disabled>Browse Templates</Button>
                        </CardFooter>
                    </Card>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
