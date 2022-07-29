import { FocusEventHandler, FormEventHandler } from "react";
import { FormControlBlockProps } from "./FormControlBlock";

export interface InputProps extends Omit<FormControlBlockProps, 'children'> {
  name: string;
  onChange: FormEventHandler;
  onBlur: FocusEventHandler;
};