import React, { FormEventHandler } from "react";
import { Block } from "baseui/block";
import { Button, ButtonProps } from "baseui/button";
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
      <FormBlock>{children}</FormBlock>
    </form>
  );
}

export const FormBlock = ({ children }: { children: React.ReactNode }) => (
  <Block
    display="flex"
    flexDirection="column"
    alignItems="stretch"
    padding="scale800"
    maxWidth="800px"
    margin="auto"
  >
    {children}
  </Block>
);

type SubmitButtonProps = {
  isLoading?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  type?: ButtonProps["type"];
  onClick?: ButtonProps["onClick"];
};

export function SubmitButton({
  isLoading,
  disabled,
  children,
  onClick,
  type = "submit",
}: SubmitButtonProps) {
  return (
    <Button
      type={type}
      disabled={disabled}
      isLoading={isLoading}
      $style={{
        margin: "auto",
        marginTop: "40px",
        maxWidth: "350px",
        width: "100%",
        alignSelf: "center",
      }}
      onClick={onClick}
    >
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
