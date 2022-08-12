import { useEffect } from "react";
import { FormikErrors, useFormikContext } from "formik";
import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";
import * as PublicKeyInput from "./PublicKey";
import useItemClass from "../../../hooks/useItemClass";
import { LoadingMessage } from "../../LoadingMessage";
import * as JSONInput from "./JSON";

export function Inline({
  title,
  help,
  value,
  name,
  error,
  onChange,
  onBlur,
  setValue,
  setError,
}: ItemClassKeyInputProps) {
  const { loading, itemClass, failed } = useItemClass(!error ? value : undefined);
  useEffect(() => {
    if (value && failed) {
      setError("Item class could not be found - please re-check the key");
    }
  }, [value, failed]);
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <>
        <PublicKeyInput.Inline
          name={name}
          setValue={setValue}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
        {!error && value && loading && (
          <LoadingMessage message={`Looking up item class ${value}...`} />
        )}
        {!error && value && !loading && itemClass && (
          <JSONInput.Display name="itemclass" value={itemClass} />
        )}
      </>
    </FormControlBlock>
  );
}

export function Formik(props: Omit<ItemClassKeyInputProps, "setValue" | "setError">) {
  const { setFieldValue, setFieldError } = useFormikContext();
  const setValue = (value: string) => {
    setFieldValue(props.name, value);
  }
  const setError = (error: string) => {
    setFieldError(props.name, error);
  }
  return <Inline {...props} setValue={setValue} setError={setError} />;
}

export interface ItemClassKeyInputProps extends InputProps {
  value: string;
  setValue: (arg: string) => void;
  setError: (arg: string) => void;
}