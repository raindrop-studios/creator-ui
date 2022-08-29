import React from "react";
import { State } from "@raindrops-protocol/raindrops";
import * as yup from "yup";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";
import { useFormikContext } from "formik";
import { Block } from "baseui/block";
import { LabelXSmall, LabelSmall } from "baseui/typography";
import { Alert } from "baseui/icon";

export const PermissivenessOptions: {
  [permissivenessType: string]: PermissivenessOption;
} = {
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

const isOptionChecked = (
  value: PermissivenessInputProps["value"],
  option: PermissivenessOption
) => (value ? value.includes(option.value) : false);
const getInheritanceStatus = (
  value: PermissivenessInputProps["value"],
  parentValue: PermissivenessInputProps["parentValue"],
  option: PermissivenessOption
) => {
  const parentHasValueForOption = (parentValue || []).includes(option?.value);
  if (parentHasValueForOption) {
    if (isOptionChecked(value, option)) {
      return State.InheritanceState.Inherited;
    }
    return State.InheritanceState.Overridden;
  }
  return State.InheritanceState.NotInherited;
};

export function Inline({
  title,
  value,
  parentValue,
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
        {mappedOptions.map((option) => {
          const checked = value && isOptionChecked(value, option);
          const inheritanceState = getInheritanceStatus(
            value,
            parentValue,
            option
          );
          return (
            <Checkbox
              checked={checked}
              disabled={false} // TODO: Include Child propagation stuff here
              // @ts-ignore
              onChange={(e: Event) => {
                e.preventDefault();
                toggleValue(option.value);
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
              {option.title}
              <LabelSmall>{option.description}</LabelSmall>
              <InheritanceAlert inheritanceState={inheritanceState} />
            </Checkbox>
          );
        })}
      </Block>
    </FormControlBlock>
  );
}

export function Formik(
  props: Omit<PermissivenessInputProps, "toggleValue" | "value"> & {
    value: (keyof State.AnchorPermissivenessType)[];
    singular?: boolean;
  }
) {
  const { setFieldValue } = useFormikContext();
  const toggleValue = (value: keyof State.AnchorPermissivenessType) => {
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
  value: (keyof State.AnchorPermissivenessType)[] | undefined;
  parentValue?: (keyof State.AnchorPermissivenessType)[] | undefined;
  toggleValue: (arg: keyof State.AnchorPermissivenessType) => void;
}

type PermissivenessOption = {
  title: string;
  description: string;
  value: keyof State.AnchorPermissivenessType;
};

function InheritanceAlert({inheritanceState} : {inheritanceState: State.InheritanceState}) {
  const getInheritanceText = (state?: State.InheritanceState) => {
    switch (state) {
      case State.InheritanceState.Inherited:
        return "Inherited from parent"
      case State.InheritanceState.Overridden:
        return <><Alert overrides={{Svg: {style: {marginRight: "5px"}}}}/>Overridden from parent</>
      default:
        return ""
    }
  }
  return (
    <LabelXSmall $style={{ marginTop: "20px", display: "flex" }}>{getInheritanceText(inheritanceState)}</LabelXSmall>
    );
}

export const validation = yup.array(
  yup
    .string()
    .defined()
    .oneOf(Object.values(PermissivenessOptions).map(({ value }) => value))
);

export const transfromFromItemClassToValue = (
  permissivenessData: State.Permissiveness[]
): PermissivenessInputProps["value"] =>
  permissivenessData.map(
    ({ permissivenessType }) =>
      Object.keys(
        State.toAnchor(permissivenessType, State.PermissivenessType)
      )?.[0] as keyof State.AnchorPermissivenessType
  );
