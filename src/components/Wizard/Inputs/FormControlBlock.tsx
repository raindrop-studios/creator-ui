import React from "react";
import { Block } from "baseui/block";
import { FormControl, FormControlProps } from "baseui/form-control";

export const FormControlBlock = ({
  title,
  help,
  error,
  children,
}: FormControlBlockProps) => (
  <Block
    display="flex"
    alignItems="flex-start"
    justifyContent="flex-start"
    flexDirection="column"
  >
    <FormControl label={title} caption={help} error={error}>
      {children}
    </FormControl>
  </Block>
);

export type FormControlBlockProps = {
  title?: FormControlProps["label"];
  help?: FormControlProps["caption"];
  children: React.ReactNode;
  error?: string | string[] | undefined;
};
