import * as React from "react";

import { Check } from "baseui/icon";
import { Grid, BEHAVIOR, Cell, ALIGNMENT } from "baseui/layout-grid";
import { Tabs, ORIENTATION, Tab, FILL } from "baseui/tabs-motion";
import { useDevice } from "use-device-react";

import { FormStep, StepLayout, StepProps } from "./FormStep";
import { useFormWizard } from "./useFormWizard";
import { Theme } from "baseui";

function Wizard<ComponentProps = {}>({
  children,
  onComplete,
  values,
  setValues,
}: WizardProps) {
  const { isMobile } = useDevice();
  const [steps, setSteps] = React.useState<StepProps<ComponentProps>[]>([]);
  const [currentStep, setCurrentStep] =
    React.useState<StepProps<ComponentProps> | undefined>();
  const {
    currentStep: currentStepIndex,
    goToNext,
    goToPrevious,
    isFirst,
    goToStep,
  } = useFormWizard({
    steps: steps.map(({ hash }) => hash),
    complete: onComplete,
  });
  React.useEffect(() => {
    const newSteps: StepProps<ComponentProps>[] = [];
    let newCurrentStep: StepProps<ComponentProps> | undefined;
    React.Children.toArray(children)
      .filter((child) => {
        return typeof child === "object";
      })
      .forEach((child, index) => {
        //@ts-ignore
        if (child?.type === FormStep) {
          //@ts-ignore
          const childProps = child?.props as StepProps<ComponentProps>;
          newSteps.push(childProps);
          if (index === currentStepIndex) {
            newCurrentStep = childProps;
          }
        }
      });
    setSteps(newSteps);
    setCurrentStep(newCurrentStep || newSteps[0]);
  }, [children, currentStepIndex]);

  if (!currentStep) return null;
  const { onPrevious, onNext } = currentStep;
  const handleGoToPrevious = () => {
    onPrevious?.(values);
    goToPrevious();
  };
  const handleGoToNext = () => {
    onNext?.(values);
    goToNext();
  };
  const tabOverrides = {
    TabPanel: {
      style: { minWidth: "70vw" },
    },
  };
  const activeKey = currentStep.hash;
  return (
    <Grid behavior={BEHAVIOR.fluid}>
      <Cell span={12} align={ALIGNMENT.start}>
        <Tabs
          activeKey={activeKey}
          orientation={isMobile ? ORIENTATION.horizontal : ORIENTATION.vertical}
          overrides={{
            TabList: {
              style: ({ $theme }: { $theme: Theme }) => ({
                [$theme.mediaQuery.medium]: { minWidth: "200px" },
              }),
            },
          }}
        >
          {steps.map((step, stepIndex) => {
            return (
              <Tab
                title={isMobile ? " " : step.title}
                key={step.hash}
                overrides={tabOverrides}
                fill={FILL.fixed}
                // @ts-ignore TODO: Check types of baseui Icon artwork
                artwork={
                  isMobile ? null : stepIndex < currentStepIndex ? Check : null
                }
                disabled={stepIndex > currentStepIndex}
                onClick={stepIndex < currentStepIndex ? () => {goToStep(stepIndex)} : null}
              >
                <StepLayout
                  {...step}
                  previous={!isFirst ? handleGoToPrevious : undefined}
                  next={handleGoToNext}
                  values={values}
                  setValues={setValues}
                  key={step?.hash}
                />
              </Tab>
            );
          })}
        </Tabs>
      </Cell>
    </Grid>
  );
}

type WizardProps = {
  children: React.ReactNode;
  onComplete: () => void;
  values: any;
  setValues: (arg: any) => void;
};

Wizard.Step = FormStep;
export { Wizard };
