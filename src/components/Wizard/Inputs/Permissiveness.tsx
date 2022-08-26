import React from "react";
import { State } from "@raindrops-protocol/raindrops";
import * as yup from "yup";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";
import { useFormikContext } from "formik";
import { Block } from "baseui/block";

export const PermissivenessOptions = {
  [State.PermissivenessType.TokenHolder]: {
    title: "Token Holder",
    description: "In order to do the action, the item class NFT must be held.",
    value: "tokenHolder",
  },
  [State.PermissivenessType.ParentTokenHolder]: {
    title: "Parent Token Holder",
    description:
      "In order to do the action, the parent class of this class NFT must be held.",
    value: "parentTokenHolder",
  },
  [State.PermissivenessType.UpdateAuthority]: {
    title: "Update Authority",
    description:
      "In order to do the action, the signer must be the update authority on the metadata of the item class or item.",
    value: "updateAuthority",
  },
  [State.PermissivenessType.Anybody]: {
    title: "Anybody",
    description:
      "Anybody can do this action. There are no requirements to be met.",
    value: "anybody",
  },
};

export function Inline({
  title,
  value,
  error,
  help,
  options,
  toggleValue,
}: PermissivenessInputProps) {
  const mappedOptions = options
    ? options.map((key) => PermissivenessOptions[key])
    : Object.values(PermissivenessOptions);
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <Block display="flex" flexWrap $style={{ gap: "10px" }}>
        {mappedOptions.map(({ value: optionValue, title, description }) => (
          <Checkbox
            checked={value && value.includes(optionValue)}
            // @ts-ignore
            onChange={(e: Event) => {
              e.preventDefault();
              toggleValue(optionValue);
            }}
            checkmarkType={STYLE_TYPE.toggle_round}
            overrides={{
              Root: {
                style: ({ $theme, $checked }) => ({
                  background: $checked
                    ? $theme.colors.contentInverseSecondary
                    : $theme.colors.contentInversePrimary,
                  border: `1px solid ${
                    $checked
                      ? $theme.colors.borderSelected
                      : $theme.colors.borderTransparent
                  }`,
                  borderRadius: "5px",
                  display: "flex",
                  flexDirection: "column-reverse",
                  alignItems: "center",
                  justifyContent: "space-evenly",
                  padding: "15px",
                  flex: 1,
                  flexBasis: "40%",
                }),
              },
              Label: {
                style: {
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                },
              },
            }}
          >
            {title}
            <small>{description}</small>
          </Checkbox>
        ))}
      </Block>
    </FormControlBlock>
  );
}

export function Formik(
  props: Omit<PermissivenessInputProps, "toggleValue" | "value"> & {
    value: string[];
    singular?: boolean;
  }
) {
  const { setFieldValue } = useFormikContext();
  const toggleValue = (value: string) => {
    let newValues = [];
    let oldValues = props.value || [];
    if (oldValues.includes(value)) {
      newValues = oldValues.filter((val) => val !== value);
    } else {
      newValues = props.singular ? [value] : [...oldValues, value];
    }
    setFieldValue(props.name, newValues);
  };
  return <Inline {...props} toggleValue={toggleValue} value={props.value} />;
}

interface PermissivenessInputProps
  extends Omit<InputProps, "onChange" | "onBlur"> {
  options?: State.PermissivenessType[];
  value: string[] | undefined;
  toggleValue: (arg: string) => void;
}

export const validation = yup.array(
  yup
    .string()
    .defined()
    .oneOf(Object.values(PermissivenessOptions).map(({ value }) => value))
);
