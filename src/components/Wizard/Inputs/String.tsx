import { Input as BaseInput } from "baseui/input";

import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";

export function Inline({
  name,
  title,
  help,
  value,
  onChange,
  onBlur,
  error,
}: StringInputProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <BaseInput
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        error={!!error}
        overrides={{
          Input: {
            style: ({ $theme }) => ({
              [$theme.mediaQuery.medium]: {
                minWidth: "500px",
              },
            }),
          },
        }}
      />
    </FormControlBlock>
  );
}

export interface StringInputProps extends InputProps {
  value: string | undefined;
}
