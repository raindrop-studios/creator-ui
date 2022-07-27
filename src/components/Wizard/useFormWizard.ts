import React, {useState, useEffect} from "react";

export const useFormWizard = ({
  steps,
  complete,
}: {
  steps: string[];
  complete: () => void;
}) => {
  const [history, setHistory] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  useEffect(() => {
    if (currentStep === steps.length) {
      complete();
    }
  }, [currentStep])
  const goToPrevious = () => {
    setCurrentStep(steps.indexOf(history[history.length - 1]))
    history.pop()
    setHistory(history);
  };
  const goToNext = () => {
    setCurrentStep(currentStep + 1);
    setHistory([...history, steps[currentStep]])
  };
  return { goToPrevious, goToNext, currentStep, isFirst: currentStep === 0 };
};
