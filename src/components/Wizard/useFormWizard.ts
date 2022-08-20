import React, { useState, useEffect } from "react";

export const useFormWizard = ({
  steps,
  complete,
}: {
  steps: string[];
  complete?: () => void;
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  useEffect(() => {
    if (currentStep && currentStep === steps.length) {
      complete?.();
    }
  }, [currentStep]);
  const goToPrevious = () => {
    if (history.length === 0) {
      throw new Error("No previous steps");
    }
    setCurrentStep(steps.indexOf(history[history.length - 1]));
    history.pop();
    setHistory(history);
  };
  const goToNext = () => {
    if (steps.length === currentStep) {
      throw new Error("No more steps");
    }
    setCurrentStep(currentStep + 1);
    setHistory([...history, steps[currentStep]]);
  };
  const goToStep = (step: number) => {
    setCurrentStep(step);
    const newStepHash = steps[step];
    const stepIndex = step === 0 ? 0 : history.findIndex(
      (historicStepHash) => historicStepHash === newStepHash
    );
    if (stepIndex === -1) {
      throw new Error("Step out of bounds");
    }
    const newHistory = history.slice(0, stepIndex);
    setHistory(newHistory);
  };
  return {
    goToPrevious,
    goToNext,
    currentStep,
    isFirst: currentStep === 0,
    goToStep,
  };
};
