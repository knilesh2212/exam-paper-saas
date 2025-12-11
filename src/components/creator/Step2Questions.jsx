import React, { useState } from 'react';
import { useExam } from '@/context/ExamContext';
import { QuestionCard } from './QuestionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ArrowLeft, ArrowRight, Trash2, Edit2, GripVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const QUESTION_TYPES = [
    { value: 'short', label: 'Short Answer' },
    { value: 'long', label: 'Long Answer / Essay' },
    { value: 'mcq', label: 'Multiple Choice' },
];

const Step2Questions = ({ onNext, onBack }) => {
    const { questions, sections, addQuestion, deleteQuestion, duplicateQuestion, updateQuestion, addSection, updateSection, deleteSection } = useExam();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [activeSectionId, setActiveSectionId] = useState(null); // For defaulting new questions

    // Form State
    const [formData, setFormData] = useState({
        type: 'short',
        questionText: '',
        marks: 2,
        difficulty: 'Medium',
        options: ['', '', '', ''],
        sectionId: '',
    });

    // Section Edit State
    const [editingSection, setEditingSection] = useState(null);

    const resetForm = () => {
        setFormData({
            type: 'short',
            questionText: '',
            marks: 2,
            difficulty: 'Medium',
            options: ['', '', '', ''],
            sectionId: activeSectionId || (sections[0] ? sections[0].id : '')
        });
        setEditingId(null);
    }

    const handleOpenChange = (open) => {
        setIsDialogOpen(open);
        if (!open) resetForm();
        else {
            // Set default section when opening
            setFormData(prev => ({
                ...prev,
                sectionId: activeSectionId || (sections[0] ? sections[0].id : '')
            }));
        }
    }

    const handleSubmit = () => {
        if (!formData.questionText) return;

        if (editingId) {
            updateQuestion(editingId, formData);
        } else {
            addQuestion(formData, formData.sectionId);
        }
        setIsDialogOpen(false);
        resetForm();
    };

    const handleEdit = (question) => {
        setFormData({
            type: question.type,
            questionText: question.questionText,
            marks: question.marks,
            difficulty: question.difficulty || 'Medium',
            options: question.options || ['', '', '', ''],
            sectionId: question.sectionId || sections[0].id
        });
        setEditingId(question.id);
        setIsDialogOpen(true);
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Actions */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white dark:bg-slate-800 p-4 rounded-lg border shadow-sm sticky top-0 z-10 gap-4">
                <div>
                    <h2 className="text-lg font-semibold">Exam Content</h2>
                    <p className="text-xs text-muted-foreground">{questions.length} Questions • {sections.length} Sections</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={addSection} className="gap-2">
                        <Plus className="h-4 w-4" />
                        Add Section
                    </Button>
                    <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                        <DialogTrigger asChild>
                            <Button className="gap-2">
                                <Plus className="h-4 w-4" />
                                Add Question
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>{editingId ? 'Edit Question' : 'Add New Question'}</DialogTitle>
                                <DialogDescription>Create a question for your exam paper.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Section</Label>
                                        <Select value={formData.sectionId} onValueChange={(v) => setFormData({ ...formData, sectionId: v })}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Section" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {sections.map(s => <SelectItem key={s.id} value={s.id}>{s.title}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Question Type</Label>
                                        <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {QUESTION_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>

                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Marks</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            value={formData.marks}
                                            onChange={(e) => setFormData({ ...formData, marks: Number(e.target.value) })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Difficulty</Label>
                                        <Select value={formData.difficulty} onValueChange={(v) => setFormData({ ...formData, difficulty: v })}>
                                            <SelectTrigger>
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Easy">Easy</SelectItem>
                                                <SelectItem value="Medium">Medium</SelectItem>
                                                <SelectItem value="Hard">Hard</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Question Text</Label>
                                    <Textarea
                                        value={formData.questionText}
                                        onChange={(e) => setFormData({ ...formData, questionText: e.target.value })}
                                        placeholder="Type your question here..."
                                        rows={3}
                                    />
                                </div>

                                {formData.type === 'mcq' && (
                                    <div className="space-y-2">
                                        <Label>Options</Label>
                                        <div className="grid grid-cols-2 gap-2">
                                            {formData.options.map((opt, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <span className="text-xs font-bold text-muted-foreground w-4">{String.fromCharCode(65 + i)}</span>
                                                    <Input
                                                        value={opt}
                                                        onChange={(e) => {
                                                            const newOpts = [...formData.options];
                                                            newOpts[i] = e.target.value;
                                                            setFormData({ ...formData, options: newOpts });
                                                        }}
                                                        className="h-8 text-sm"
                                                        placeholder={`Option ${i + 1}`}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                                <Button onClick={handleSubmit}>{editingId ? 'Save Changes' : 'Add Question'}</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            {/* Sections List */}
            <div className="space-y-8 pb-20">
                {sections.map((section) => (
                    <div key={section.id} className="relative group">
                        {/* Section Header */}
                        <div className="flex items-center gap-4 mb-4 group-header">
                            <div className="flex-1">
                                {editingSection === section.id ? (
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            value={section.title}
                                            onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                            className="font-bold text-lg h-8 w-40"
                                        />
                                        <Input
                                            value={section.instructions}
                                            onChange={(e) => updateSection(section.id, { instructions: e.target.value })}
                                            className="text-sm h-8 flex-1"
                                            placeholder="Section Instructions (optional)"
                                        />
                                        <Button size="sm" onClick={() => setEditingSection(null)}>Save</Button>
                                    </div>
                                ) : (
                                    <div className="flex flex-col">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-lg font-bold hover:underline cursor-pointer decoration-dotted" onClick={() => setEditingSection(section.id)}>
                                                {section.title}
                                            </h3>
                                            <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover/header:opacity-100" onClick={() => setEditingSection(section.id)}>
                                                <Edit2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        {section.instructions && <p className="text-sm text-muted-foreground">{section.instructions}</p>}
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="text-muted-foreground hover:text-primary"
                                    onClick={() => {
                                        setActiveSectionId(section.id);
                                        setIsDialogOpen(true);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-1" /> Add Question
                                </Button>
                                {sections.length > 1 && (
                                    <Button variant="ghost" size="sm" className="hover:text-destructive" onClick={() => deleteSection(section.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                        </div>

                        {/* Questions List for this Section */}
                        <div className="space-y-3 min-h-[50px] p-2 rounded-lg border-2 border-transparent hover:border-dashed hover:border-slate-200 transition-colors">
                            {questions.filter(q => (q.sectionId === section.id) || (!q.sectionId && section.id === sections[0].id)).length === 0 ? (
                                <div className="text-center py-8 text-muted-foreground text-sm bg-slate-50 rounded-lg border border-dashed">
                                    No questions in this section.
                                </div>
                            ) : (
                                questions
                                    .filter(q => (q.sectionId === section.id) || (!q.sectionId && section.id === sections[0].id))
                                    .map((q, index) => (
                                        <QuestionCard
                                            key={q.id}
                                            index={questions.indexOf(q)} // Use global index or section index? Let's use global index for now
                                            question={q}
                                            onDelete={deleteQuestion}
                                            onDuplicate={duplicateQuestion}
                                            onEdit={handleEdit}
                                        />
                                    ))
                            )}
                        </div>
                    </div>
                ))}
            </div>


            <Separator className="my-6" />

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <Button size="lg" onClick={onNext} className="gap-2" disabled={questions.length === 0}>
                    Next Step: Layout
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Step2Questions;
