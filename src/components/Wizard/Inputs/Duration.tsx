import * as React from "react";
import { Input } from "baseui/input";
import { useDevice } from "use-device-react";

import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";
import { Block } from "baseui/block";

export function Inline({
  name,
  title,
  help,
  onChange,
  onBlur,
  value,
  error,
  units,
}: DurationInputProps) {
  const { isMobile } = useDevice();
  const daysInput = units.includes(Units.days) ? (
    <IndividualInput
      name={name}
      error={error}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      unit={Units.days}
    />
  ) : null;
  const hoursInput = units.includes(Units.hours) ? (
    <IndividualInput
      name={name}
      error={error}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      unit={Units.hours}
    />
  ) : null;
  const minutesInput = units.includes(Units.minutes) ? (
    <IndividualInput
      name={name}
      error={error}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      unit={Units.minutes}
    />
  ) : null;
  const secondsInput = units.includes(Units.seconds) ? (
    <IndividualInput
      name={name}
      error={error}
      value={value}
      onBlur={onBlur}
      onChange={onChange}
      unit={Units.seconds}
    />
  ) : null;
  return (
    <FormControlBlock title={title} help={help}>
      <Block display="flex" flexDirection={isMobile ? "column" : "row"}>
        {daysInput}
        {hoursInput}
        {minutesInput}
        {secondsInput}
      </Block>
    </FormControlBlock>
  );
}

function IndividualInput({
  name,
  error,
  value,
  onChange,
  onBlur,
  unit,
}: IndividualInputProps) {
  return (
    <FormControlBlock error={error?.[unit]}>
      <Input
        name={`${name}.${unit}`}
        value={value?.[unit]}
        min={0}
        step={1}
        endEnhancer={`${unit.replace(new RegExp("s$"), "")}(s)`}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error?.[unit]}
        type="number"
        overrides={{
          Input: {
            style: ({ $theme }) => ({
              [$theme.mediaQuery.medium]: {
                maxWidth: "100px",
              },
            }),
          },
        }}
      />
    </FormControlBlock>
  );
}

export enum Units {
  days = "days",
  hours = "hours",
  minutes = "minutes",
  seconds = "seconds",
}

interface IndividualInputProps extends Omit<DurationInputProps, "units"> {
  unit: Units;
}

type DurationObject = {
    [Property in keyof typeof Units]?: number | undefined;
}

type MutableDurationObject = {
  -readonly [Property in keyof DurationObject]?: number | undefined;
};

export interface DurationInputProps extends Omit<InputProps, "error"> {
  value: DurationObject |undefined;
  error: {
        [Property in keyof DurationObject]?: string;
      }
    | undefined;
  units: Units[];
}

const UnitsInMs = {
  [Units.days]: 24 * 60 * 60 * 1000,
  [Units.hours]: 60 * 60 * 1000,
  [Units.minutes]: 60 * 1000,
  [Units.seconds]: 1000
};

export function toMilliseconds(duration: DurationObject) {
  let totalMs = 0;
  Object.values(Units).forEach(unit => {
    totalMs += (duration?.[unit] || 0) * UnitsInMs[unit];
  })
  return totalMs;
}

export function toDurationObject(durationInMs: number, units?: Units[]) {
  let remainingMs = durationInMs;
  let durationObject: MutableDurationObject = {};
  (units || Object.values(Units)).forEach(unit => {
    const leftoverMs = remainingMs % UnitsInMs[unit];
    durationObject[unit] = (remainingMs - leftoverMs) / UnitsInMs[unit];
    remainingMs = leftoverMs
  })
  if (remainingMs) {
    throw new Error(`We have ${remainingMs} spare ms!`)
  }
  return durationObject;
}