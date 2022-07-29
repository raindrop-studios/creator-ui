import React, { useRef } from "react";

import { web3 } from "@project-serum/anchor";
import { useStyletron } from "baseui";
import { Input as BaseInput } from "baseui/input";
import { Block } from "baseui/block";
import { useFormikContext } from "formik";
import * as yup from "yup";

import { ReactComponent as PasteIcon } from "../../../assets/paste.svg";
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
  setValue,
}: PublicKeyInputProps) {
  const inputRef = useRef(null);
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <BaseInput
        name={name}
        ref={inputRef}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        endEnhancer={<PasteButton setValue={setValue} />}
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

export function Formik (props: Omit<PublicKeyInputProps, 'setValue'>) {
  const { setFieldValue } = useFormikContext();
  const setValue = (value: string) => setFieldValue(props.name, value)
  return (
    <Inline {...props} setValue={setValue} />
  )
}

const PasteButton = ({ setValue }: { setValue: Function }) => {
  const [, theme] = useStyletron();
  const pasteToTarget = async () => {
    const clipboardValue = await navigator.clipboard.readText();
    setValue(clipboardValue);
  };
  return (
    <Block
      height={theme.sizing.scale900}
      width={theme.sizing.scale900}
      onClick={(e: Event) => {
        e.preventDefault();
        pasteToTarget();
      }}
      $style={{ cursor: "pointer" }}
    >
      <PasteIcon fill={theme.colors.primaryA} viewBox="0 0 48 48" />
    </Block>
  );
};

function validatePublicKey(value: string | undefined) {
  if (value) {
    try {
      new web3.PublicKey(value);
    } catch (e) {
      return false;
    }
  }
  return true;
}

const yupPublicKey = yup
  .string()
  .test("is-public-key", "Not a valid public key", validatePublicKey);

export { yupPublicKey as validation };

export interface PublicKeyInputProps extends InputProps {
  value: string | undefined;
  setValue: (arg: string) => void;
}
