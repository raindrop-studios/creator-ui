import React from "react";
import { State } from "@raindrops-protocol/raindrops";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";

import { FormControlBlock } from "../FormControlBlock";
import { useFormikContext } from "formik";
import { Block } from "baseui/block";
import { LabelSmall } from "baseui/typography";
import { Alert } from "baseui/icon";
import { KIND, Notification } from "baseui/notification";
import { PermissivenessArray, PermissivenessInputProps } from "./types";
import { PermissivenessOptions } from "./constants";
import {
  getInheritanceStatus,
  getParentItemClassProperties,
  isOptionChecked,
  transformFromValueToItemClass,
  transfromFromItemClassToValue,
  validation,
} from "./utils";
import InheritanceAlert from "./InheritanceAlert";

export function Inline({
  title,
  value,
  error,
  help,
  toggleValue,
  parentItemClass,
  permissivenessType,
}: PermissivenessInputProps) {
  const permissivenessOptions = parentItemClass
    ? [
        State.PermissivenessType.TokenHolder,
        State.PermissivenessType.ParentTokenHolder,
        State.PermissivenessType.UpdateAuthority,
        State.PermissivenessType.Anybody,
      ]
    : [
        State.PermissivenessType.TokenHolder,
        State.PermissivenessType.UpdateAuthority,
        State.PermissivenessType.Anybody,
      ];
  const { parentValue, overridden } = getParentItemClassProperties(
    parentItemClass,
    permissivenessType
  );
  const mappedOptions = permissivenessOptions.map(
    (key) => PermissivenessOptions[key]
  );
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
              disabled={overridden}
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
        {overridden && (
          <Notification
            kind={KIND.info}
            overrides={{
              Body: { style: { flexBasis: "100%" } },
              InnerContainer: {
                style: { display: "flex", alignItems: "center" },
              },
            }}
          >
            <Alert
              overrides={{ Svg: { style: { marginRight: "5px" } } }}
              size="scale800"
            />{" "}
            Parent has disallowed editing of this permissiveness, the above is
            for information only.
          </Notification>
        )}
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

export {
  validation,
  PermissivenessOptions,
  transformFromValueToItemClass,
  transfromFromItemClassToValue,
};
export type { PermissivenessArray };
