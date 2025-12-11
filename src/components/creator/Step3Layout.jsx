import React from 'react';
import { useExam } from '@/context/ExamContext';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Step3Layout = ({ onBack, onNext }) => {
    const { examMeta, questions, styles, updateStyles } = useExam();

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <Card>
                <CardHeader>
                    <CardTitle>Page Settings</CardTitle>
                    <CardDescription>Customize the paper format and typography.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Paper Size</Label>
                            <Select value={styles.paperSize} onValueChange={(v) => updateStyles({ paperSize: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="A4">A4</SelectItem>
                                    <SelectItem value="LETTER">Letter</SelectItem>
                                    <SelectItem value="LEGAL">Legal</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Font Family</Label>
                            <Select value={styles.fontFamily} onValueChange={(v) => updateStyles({ fontFamily: v })}>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Helvetica">Helvetica (Sans-Serif)</SelectItem>
                                    <SelectItem value="Times-Roman">Times New Roman (Serif)</SelectItem>
                                    <SelectItem value="Courier">Courier (Monospace)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Orientation</Label>
                        <RadioGroup
                            defaultValue="portrait"
                            value={styles.orientation}
                            onValueChange={(v) => updateStyles({ orientation: v })}
                            className="flex gap-4"
                        >
                            <div className="flex items-center space-x-2">
                                <RadioGroupItem value="portrait" id="portrait" />
                                <Label htmlFor="portrait">Portrait</Label>
                            </div>
                            {/* <div className="flex items-center space-x-2">
                        <RadioGroupItem value="landscape" id="landscape" />
                        <Label htmlFor="landscape">Landscape</Label>
                    </div> */}
                            {/* React-PDF Page orientation prop handling is tricky with dynamic updates, simple Portrait for MVP */}
                        </RadioGroup>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Content Display</CardTitle>
                    <CardDescription>Toggle visibility of elements in the question paper.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Show Marks</Label>
                            <p className="text-sm text-muted-foreground">Display marks allocated next to each question.</p>
                        </div>
                        <Switch
                            checked={styles.showMarks}
                            onCheckedChange={(c) => updateStyles({ showMarks: c })}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label className="text-base">Answer Lines / Spaces</Label>
                            <p className="text-sm text-muted-foreground">Add spacing or lines for students to write answers.</p>
                        </div>
                        <Switch
                            checked={styles.showLines}
                            onCheckedChange={(c) => updateStyles({ showLines: c })}
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-between pt-4">
                <Button variant="outline" onClick={onBack} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </Button>
                <div className="flex gap-2">
                    <Button size="lg" onClick={onNext} className="gap-2">
                        Next: Preview
                        <ArrowRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Step3Layout;
