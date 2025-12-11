import React from 'react';
import { useExam } from '@/context/ExamContext';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, ArrowRight } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const Step1BasicInfo = ({ onNext }) => {
    const { examMeta, updateExamMeta } = useExam();

    const handleChange = (e) => {
        const { name, value } = e.target;
        updateExamMeta({ [name]: value });
    };

    const handleInstructionChange = (index, value) => {
        const newInstructions = [...examMeta.instructions];
        newInstructions[index] = value;
        updateExamMeta({ instructions: newInstructions });
    };

    const addInstruction = () => {
        updateExamMeta({ instructions: [...examMeta.instructions, ''] });
    };

    const removeInstruction = (index) => {
        const newInstructions = examMeta.instructions.filter((_, i) => i !== index);
        updateExamMeta({ instructions: newInstructions });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Exam Details</CardTitle>
                    <CardDescription>Enter the primary information for the examination.</CardDescription>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2 sm:col-span-2">
                        <Label htmlFor="institutionName">Institution / School Name</Label>
                        <Input
                            id="institutionName"
                            name="institutionName"
                            placeholder="e.g. Springfield High School"
                            value={examMeta.institutionName}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subject">Subject</Label>
                        <Input
                            id="subject"
                            name="subject"
                            placeholder="e.g. Mathematics"
                            value={examMeta.subject}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="grade">Grade / Class</Label>
                        <Input
                            id="grade"
                            name="grade"
                            placeholder="e.g. 10th Grade"
                            value={examMeta.grade}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="date">Date</Label>
                        <Input
                            id="date"
                            name="date"
                            type="date"
                            value={examMeta.date}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        {/* Placeholder for Term/Semester if needed */}
                        <Label htmlFor="examTitle">Exam Title / Type</Label>
                        <Input
                            id="examTitle"
                            placeholder="e.g. Mid-Term Examination"
                        // For now mapping to custom field or just extra info? Use 'term' if added to meta.
                        // Let's stick to simple fields for now or assume user puts it in Title
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Timing & Marks</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                        <Label htmlFor="duration">Duration (minutes)</Label>
                        <Input
                            id="duration"
                            name="duration"
                            type="number"
                            placeholder="60"
                            value={examMeta.duration}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="totalMarks">Total Marks</Label>
                        <Input
                            id="totalMarks"
                            name="totalMarks"
                            type="number"
                            placeholder="100"
                            value={examMeta.totalMarks}
                            onChange={handleChange}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>General Instructions</CardTitle>
                    <CardDescription>Instructions displayed at the top of the paper.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {examMeta.instructions.map((inst, index) => (
                        <div key={index} className="flex gap-2 items-start">
                            <span className="mt-2 text-sm text-muted-foreground w-4">{index + 1}.</span>
                            <Textarea
                                value={inst}
                                onChange={(e) => handleInstructionChange(index, e.target.value)}
                                placeholder="Enter instruction..."
                                className="flex-grow resize-y"
                                rows={1}
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => removeInstruction(index)}
                                disabled={examMeta.instructions.length <= 1}
                                className="text-muted-foreground hover:text-destructive"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}

                    <Button variant="outline" size="sm" onClick={addInstruction} className="mt-2">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Instruction
                    </Button>
                </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
                <Button size="lg" onClick={onNext} className="gap-2">
                    Next Step: Questions
                    <ArrowRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default Step1BasicInfo;
