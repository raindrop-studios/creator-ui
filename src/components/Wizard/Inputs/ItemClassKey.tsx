import { useEffect } from "react";
import { useFormikContext } from "formik";
import { State } from "@raindrops-protocol/raindrops";

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
  setItemClass,
}: ItemClassKeyInputProps) {
  const { loading, itemClass, failed } = useItemClass(value);
  useEffect(() => {
    if (value && !loading) {
      if (failed) {
        setError("Item class could not be found - please re-check the key");
      } else if (itemClass) {
        setItemClass(itemClass)
      }
    }
  }, [value, failed, itemClass, loading]);
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
        {!failed && value && !loading && itemClass && (
          <JSONInput.Display name="itemclass" value={itemClass} />
        )}
      </>
    </FormControlBlock>
  );
}

export function Formik(
  props: Omit<ItemClassKeyInputProps, "setValue" | "setError" | "setItemClass">
) {
  const { setFieldValue, setFieldError, errors } = useFormikContext();
  const setValue = (value: string) => {
    setFieldValue(props.name, value);
  };
  const setError = (error: string) => {
    setFieldError(props.name, error);
  };
  const ITEMCLASS_FIELD = `${props.name}_itemclass`
  const setItemClass = (value: State.Item.ItemClass) => {
    setFieldValue(ITEMCLASS_FIELD, value);
  };
  // @ts-ignore
  const itemClassError : string = Object.values(errors?.[ITEMCLASS_FIELD] || {})?.[0]
  return (
    <Inline
      {...props}
      error={props.error || itemClassError}
      setValue={setValue}
      setError={setError}
      setItemClass={setItemClass}
    />
  );
}

export interface ItemClassKeyInputProps extends InputProps {
  value: string;
  setValue: (arg: string) => void;
  setError: (arg: string) => void;
  setItemClass: (arg: State.Item.ItemClass) => void;
}