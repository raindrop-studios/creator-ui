import React, { FormEventHandler } from "react";
import { Block } from "baseui/block";
import { Button } from "baseui/button";
import { useFormikContext } from "formik";

export function Form({
  onSubmit,
  children,
}: {
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: React.ReactNode;
}) {
  return (
    <form onSubmit={onSubmit}>
      <Block display="flex" flexDirection="column" alignItems="flex-end">
        {children}
      </Block>
    </form>
  );
}

type SubmitButtonProps = {
  isLoading: boolean;
  disabled: boolean;
  children: React.ReactNode;
};

export function SubmitButton({
  isLoading,
  disabled,
  children,
}: SubmitButtonProps) {
  return (
    <Button type="submit" disabled={disabled} isLoading={isLoading}>
      {children}
    </Button>
  );
}

export function FormikSubmitButton({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isValid, isSubmitting, isValidating } = useFormikContext();
  return (
    <SubmitButton disabled={!isValid} isLoading={isSubmitting || isValidating}>
      {children}
    </SubmitButton>
  );
}
