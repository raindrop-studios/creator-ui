import React from "react";

import { Button } from "baseui/button";
import { ButtonGroup, MODE } from "baseui/button-group";
import { RadioGroup, Radio } from "baseui/radio";

import { FormControlBlock, FormControlBlockProps } from "./FormControlBlock";
import { InputProps } from "./common";

export function Inline({
  title,
  help,
  options,
  name,
  onChange,
  onBlur,
  value,
  error,
}: RadioInputProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <RadioGroup name={name} onChange={onChange} onBlur={onBlur} value={value}>
        {options.map(({ title, value, description }) => (
          <Radio value={value} description={description} key={`option_${name}_${value}`}>
            {title}
          </Radio>
        ))}
      </RadioGroup>
    </FormControlBlock>
  );
}

export function Standalone({
  options,
  onSelect,
  onDeselect,
  value,
  ...innerProps
}: RadioInputStandaloneProps) {
  const [touched, setTouched] = React.useState<boolean>(false)
  const [selected, setSelected] = React.useState<number>(
    options.findIndex(({ value: optionValue }) => optionValue === value)
    );
  const selectedValue: typeof value =
    selected === -1 ? undefined : options[selected].value;
  const handleSelect = (value: number) => {
    setTouched(true);
    setSelected(value);
  }

  React.useEffect(() => {
    if (touched) {
      if (selected !== -1) {
        onSelect(selectedValue);
      } else if (onDeselect) {
        onDeselect();
      }
    }
  }, [selectedValue, value]);
  return (
    <Inner
      options={options}
      selected={selected}
      setSelected={handleSelect}
      {...innerProps}
    />
  );
}

function Inner({
  options,
  title,
  help,
  selected,
  setSelected,
  error,
}: InnerProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <ButtonGroup
        mode={MODE.radio}
        selected={selected}
        onClick={(_event, index) => {
          setSelected(index === selected ? -1 : index);
        }}
      >
        {options.map(({ title, value }) => {
          return (
            <Button key={`option_${value}`} type="button">
              {title}
            </Button>
          );
        })}
      </ButtonGroup>
    </FormControlBlock>
  );
}

export type RadioOption = {
  title: React.ReactNode;
  description?: string;
  value: string;
};

interface RadioInputProps extends InputProps {
  options: RadioOption[];
  value: string | undefined;
}

interface RadioInputStandaloneProps
  extends Omit<InnerProps, "selected" | "setSelected"> {
  onSelect: (arg: any) => void;
  onDeselect?: () => void;
  value: any;
}

interface InnerProps extends Omit<FormControlBlockProps, "children"> {
  options: RadioOption[];
  selected: number;
  setSelected: (arg: number) => void;
}
