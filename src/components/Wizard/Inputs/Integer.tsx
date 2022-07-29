import React from "react";
import { InputProps as BaseInputProps, Input } from "baseui/input";

import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";

export function Inline({
  name,
  min,
  max,
  step,
  title,
  help,
  onChange,
  onBlur,
  value,
  error,
  endEnhancer,
}: IntegerInputProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <Input
        name={name}
        endEnhancer={endEnhancer}
        value={value}
        min={min || 0}
        max={max || 100}
        step={step || 1}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error}
        type="number"
      />
    </FormControlBlock>
  );
}

export interface IntegerInputProps extends InputProps {
  min?: BaseInputProps["min"];
  max?: BaseInputProps["max"];
  step?: BaseInputProps["step"];
  value: number | undefined;
  endEnhancer?: BaseInputProps["endEnhancer"];
}
