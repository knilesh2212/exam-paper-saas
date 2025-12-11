import React, { useState } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ScrollArea } from "@/components/ui/scroll-area";
import Step1BasicInfo from "@/components/creator/Step1BasicInfo";
import Step2Questions from "@/components/creator/Step2Questions";
import Step3Layout from "@/components/creator/Step3Layout";
import LivePreview from "@/components/preview/LivePreview";
import { cn } from "@/lib/utils";
import { CheckCircle2, Eye } from "lucide-react";

const StepItem = ({ step, title, current, onClick }) => {
    const isActive = current === step;
    const isCompleted = current > step;

    return (
        <button
            onClick={() => onClick(step)}
            className={cn(
                "flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium transition-colors whitespace-nowrap",
                isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted text-muted-foreground",
                // Disable clicking on future steps
                !isCompleted && !isActive ? "opacity-50 cursor-not-allowed" : ""
            )}
            disabled={!isCompleted && !isActive}
        >
            {isCompleted ? <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" /> : <div className={cn("h-3 w-3 md:h-4 md:w-4 rounded-full border flex items-center justify-center text-[8px] md:text-[10px]", isActive ? "border-primary-foreground" : "border-muted-foreground")}>{step}</div>}
            <span className="hidden sm:inline">{title}</span>
            <span className="sm:hidden">{step}</span>
        </button>
    )
}

const ExamCreator = () => {
    const [currentStep, setCurrentStep] = useState(1);

    return (
        <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
            <Navbar />

            {/* Stepper Header */}
            <div className="border-b bg-muted/30 p-2 shrink-0">
                <div className="flex justify-center items-center gap-2 overflow-x-auto hide-scrollbar">
                    <StepItem step={1} title="Basic Info" current={currentStep} onClick={setCurrentStep} />
                    <div className="w-4 md:w-8 h-px bg-border shrink-0"></div>
                    <StepItem step={2} title="Questions" current={currentStep} onClick={setCurrentStep} />
                    <div className="w-4 md:w-8 h-px bg-border shrink-0"></div>
                    <StepItem step={3} title="Layout" current={currentStep} onClick={setCurrentStep} />
                    <div className="w-4 md:w-8 h-px bg-border shrink-0"></div>
                    <StepItem step={4} title="Preview & Export" current={currentStep} onClick={setCurrentStep} />
                </div>
            </div>

            <div className="flex-grow overflow-hidden relative">
                {/* Steps Container */}
                {currentStep !== 4 ? (
                    <ScrollArea className="h-full">
                        <div className="p-4 md:p-8 max-w-3xl mx-auto w-full pb-20 fade-in zoom-in-95 duration-200">
                            {currentStep === 1 && <Step1BasicInfo onNext={() => setCurrentStep(2)} />}
                            {currentStep === 2 && <Step2Questions onNext={() => setCurrentStep(3)} onBack={() => setCurrentStep(1)} />}
                            {currentStep === 3 && <Step3Layout onNext={() => setCurrentStep(4)} onBack={() => setCurrentStep(2)} />}
                        </div>
                    </ScrollArea>
                ) : (
                    <div className="h-full w-full fade-in slide-in-from-right-4 duration-300">
                        <LivePreview onBack={() => setCurrentStep(3)} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExamCreator;
