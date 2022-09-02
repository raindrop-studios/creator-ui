import React from "react";

import { Button } from "baseui/button";
import { ButtonGroup, MODE } from "baseui/button-group";
import { RadioGroup, Radio } from "baseui/radio";

import { FormControlBlock, FormControlBlockProps } from "./FormControlBlock";
import { InputProps } from "./common";
import { getInheritanceState } from "./inheritance/utils";
import OverriddenNotification from "./inheritance/OverriddenNotification";
import InheritanceAlert from "./inheritance/InheritanceAlert";

export function Inline({
  title,
  help,
  options,
  name,
  onChange,
  onBlur,
  value,
  error,
  children,
  disabled,
}: RadioInputProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <>
        <RadioGroup
          name={name}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
          disabled={disabled}
        >
          {options.map(({ title, value, description }) => (
            <Radio
              value={value}
              description={description}
              key={`option_${name}_${value}`}
            >
              {title}
            </Radio>
          ))}
        </RadioGroup>
        {children}
      </>
    </FormControlBlock>
  );
}

export function InheritedBoolean({
  parentValue,
  overridden,
  trueValue,
  falseValue,
  ...props
}: RadioInputProps & {
  parentValue?: boolean;
  overridden?: boolean;
  trueValue: RadioInputProps["value"];
  falseValue: RadioInputProps["value"];
}) {
  const inheritanceState = getInheritanceState(
    props.value === trueValue || false,
    parentValue
  );
  return (
    <Inline {...props} disabled={overridden}>
      {overridden ? (
        <OverriddenNotification />
      ) : (
        <InheritanceAlert inheritanceState={inheritanceState} />
      )}
    </Inline>
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
  disabled,
  error,
}: InnerProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <ButtonGroup
        mode={MODE.radio}
        disabled={disabled}
        selected={selected}
        onClick={(_event, index) => {
          setSelected(index === selected ? -1 : index);
        }}
        overrides={{
          Root: {
            style: {
              width: "fit-content",
              marginLeft: "auto",
              marginRight: "auto",
            },
          },
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

export const getBooleanFromString = (strVal: string) => {
  switch (strVal) {
    case "true":
      return true;
    case "false":
      return false;
    default:
      return undefined;
  }
};

export const getStringFromBoolean = (boolVal: boolean | undefined) => {
  switch (boolVal) {
    case true:
      return "true";
    case false:
      return "false";
    default:
      return "";
  }
};

export type RadioOption = {
  title: React.ReactNode;
  description?: string;
  value: string;
};

interface RadioInputProps extends InputProps {
  options: RadioOption[];
  value: string | undefined;
  children?: React.ReactNode;
  disabled?: boolean;
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
  disabled?: boolean;
}
