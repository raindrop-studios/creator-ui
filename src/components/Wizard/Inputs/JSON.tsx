import { useFormikContext } from "formik";
import JSONInput from "react-json-editor-ajrm";
// @ts-ignore
import locale from "react-json-editor-ajrm/locale/en";
import { InputProps } from "./common";
import { FormControlBlock } from "./FormControlBlock";

export function Formik(props: Omit<JSONInputProps, "setValue">) {
  const { setFieldValue } = useFormikContext();
  const setValue = (value: JSONInputProps["value"]) =>
    setFieldValue(props.name, value);
  return <Inline {...props} setValue={setValue} />;
}

export function Display(props: Omit<JSONInputProps, "onChange">) {
  const { setValue, ...innerProps } = props;
  return <Inline {...innerProps} />;
}

export function Inline({
  name,
  value,
  title,
  help,
  error,
  setValue,
}: JSONInputProps) {
  const onChange = setValue
    ? ({ jsObject }: { jsObject: object }) => setValue(jsObject)
    : undefined;
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <JSONInput
        id={name}
        placeholder={value}
        locale={locale}
        height="60vh"
        width="60vw"
        viewOnly={!setValue}
        onChange={onChange}
      />
    </FormControlBlock>
  );
}

interface JSONInputProps extends Omit<InputProps, "onChange" | "onBlur"> {
  value: object;
  setValue?: (arg: object) => void;
  disabled?: boolean;
}
