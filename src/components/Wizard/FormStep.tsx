import React from "react";
import { Block } from "baseui/block";
import { Button, KIND } from "baseui/button";
import { ArrowLeft } from "baseui/icon";

export function FormStep<ComponentProps = {}>({
  title,
  description,
  Component,
}: StepProps<ComponentProps>) {
  return null;
}

export function StepLayout<ComponentProps = {}>({
  previous,
  next,
  Component,
  values,
  setValues,
  ...componentProps
}: StepLayoutProps<ComponentProps>) {
  const onSubmit = (arg: any) => {
    setValues({ ...values, ...arg });
    next();
  };
  return (
    <Block
      display="flex"
      alignItems="stretch"
      flexDirection="column"
      height="100%"
    >
      {!!previous ? (
        <Button
          type="button"
          onClick={previous}
          style={{ alignSelf: "flex-start" }}
          kind={KIND.tertiary}
          alt="Go to previous step"
        >
          <ArrowLeft />
        </Button>
      ) : (
        <div />
      )}
      <Component
        {...(componentProps as ComponentProps)}
        handleSubmit={onSubmit}
        data={values}
      />
    </Block>
  );
}

export type SubStepProps = {
  handleSubmit: (arg: any) => void;
  data: any;
};

export type StepProps<ComponentProps = {}> = {
  title: string;
  hash: string;
  description?: React.ReactNode;
  onPrevious?: (arg?: any) => void;
  onNext?: (arg?: any) => void;
  Component: React.FC<ComponentProps & SubStepProps>;
} & ComponentProps;

export type StepLayoutProps<ComponentProps = {}> = {
  previous?: () => void;
  next: () => void;
  Component: React.FC<ComponentProps & SubStepProps>;
  values: any;
  setValues: (arg: any) => void;
};
