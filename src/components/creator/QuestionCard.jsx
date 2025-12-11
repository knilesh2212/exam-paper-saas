import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash2, Copy, GripVertical, Edit } from 'lucide-react';

export const QuestionCard = ({ question, index, onDelete, onDuplicate, onEdit }) => {
    return (
        <Card className="mb-4 relative group hover:border-primary/50 transition-colors">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-50 cursor-grab active:cursor-grabbing p-2 hover:bg-slate-100 rounded">
                <GripVertical className="h-4 w-4" />
            </div>
            <CardContent className="p-4 pl-12">
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="font-mono text-xs">Q{index + 1}</Badge>
                            <Badge variant={question.difficulty === 'Hard' ? 'destructive' : question.difficulty === 'Medium' ? 'warning' : 'secondary'} className="text-[10px]">
                                {question.difficulty || 'Medium'}
                            </Badge>
                            <span className="text-xs text-muted-foreground ml-auto bg-slate-100 px-2 py-0.5 rounded">
                                {question.marks} marks
                            </span>
                        </div>
                        <p className="font-medium text-sm whitespace-pre-wrap">{question.questionText}</p>

                        {question.type === 'mcq' && question.options && (
                            <div className="grid grid-cols-2 gap-2 mt-3 pl-4">
                                {question.options.map((opt, i) => (
                                    <div key={i} className="text-xs text-slate-600 flex gap-1">
                                        <span className="font-semibold">{String.fromCharCode(97 + i)}.</span>
                                        <span>{opt}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(question)}>
                            <Edit className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onDuplicate(question.id)}>
                            <Copy className="h-4 w-4 text-slate-500" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-destructive" onClick={() => onDelete(question.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};
