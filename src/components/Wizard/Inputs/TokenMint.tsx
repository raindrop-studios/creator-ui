import { useFormikContext } from "formik";

import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";
import * as PublicKeyInput from "./PublicKey";
import TokenDisplay from "../../TokenDisplay";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";

export function Inline({
  title,
  help,
  value,
  name,
  error,
  onChange,
  onBlur,
  setValue,
  setMetadataValue,
}: TokenMintInputProps) {
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
        {!error && value && (
          <TokenDisplay mintAddr={value} setMetadata={setMetadataValue} />
        )}
      </>
    </FormControlBlock>
  );
}

export function Formik(
  props: Omit<TokenMintInputProps, "setValue" | "setError" | "setMetadataValue">
) {
  const { setFieldValue, setFieldError } = useFormikContext();
  const setValue = (value: string) => {
    setFieldValue(props.name, value);
  };
  const setError = (error: string) => {
    setFieldError(props.name, error);
  };
  const setMetadataValue = (value: Metadata | undefined) =>
    setFieldValue(`${props.name}_metadata`, value);
  return (
    <Inline
      {...props}
      setValue={setValue}
      setError={setError}
      setMetadataValue={setMetadataValue}
    />
  );
}

export interface TokenMintInputProps extends InputProps {
  value: string;
  setValue: (arg: string) => void;
  setError: (arg: string) => void;
  setMetadataValue: (arg: Metadata | undefined) => void;
}