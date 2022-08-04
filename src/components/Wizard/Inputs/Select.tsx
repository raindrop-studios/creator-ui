import { Option, Select, SelectProps, Value } from "baseui/select";
import { useFormikContext } from "formik";
import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";

export function Inline({
  title,
  help,
  value,
  error,
  setValue,
  options,
  multi,
  creatable,
}: SelectInputProps) {
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <Select
        creatable={creatable}
        options={options}
        labelKey="label"
        valueKey="id"
        onChange={({ value } : {value: Value}) => setValue(value)}
        value={value}
        multi={multi}
      />
    </FormControlBlock>
  );
}

export function Formik(props: Omit<SelectInputProps, "setValue" | "value"> & {value: string[]}) {
  const { setFieldValue } = useFormikContext();
  let optionValue : Value = [];
  if (props.value.length > 0) {
      optionValue = (props.options || []).filter(
        ({ id }: Option) => props.value.includes(id === undefined ? "" : id.toString())
      );
      if (optionValue.length === 0 && props.creatable) {
        optionValue = props.value.map(valueString => ({id: valueString, label: valueString, isCreatable: true}))
      }
  }
  const setValue = (value: Value) => {
    setFieldValue(props.name, value.map(({id}) => id));
  }
  return <Inline {...props} setValue={setValue} value={optionValue} />;
}

export const transformOptions = (stringOptions : string[]) : Option[] => {
  let uniqueOptions : string[] = [];
  stringOptions.forEach(opt => {
    if (opt && !uniqueOptions.includes(opt)) {
      uniqueOptions.push(opt)
    }
  })
  return uniqueOptions.map(opt => ({
    id: opt,
    label: opt,
  }))
}

export interface SelectInputProps extends Omit<InputProps, 'onChange' | 'onBlur'> {
  value: Value;
  creatable?: boolean;
  setValue: (arg: Value) => void;
  options: Option[];
  multi?: SelectProps['multi']
}
