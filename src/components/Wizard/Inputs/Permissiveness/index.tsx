import React from "react";

import { State } from "@raindrops-protocol/raindrops";
import { Checkbox, STYLE_TYPE } from "baseui/checkbox";
import { Block } from "baseui/block";
import { LabelSmall } from "baseui/typography";
import { useFormikContext } from "formik";

import { FormControlBlock } from "../FormControlBlock";
import { PermissivenessArray, PermissivenessInputProps, PermissivenessOption } from "./types";
import { PermissivenessOptions } from "./constants";
import {
  getInheritanceStatus,
  getParentItemClassProperties,
  isOptionChecked,
  transfromToValue,
  transformFromValueToItemClassChildUpdatePropagation,
  transformFromValueToItemClassPermissiveness,
  validation,
  getOptions,
} from "./utils";
import InheritanceAlert from "../inheritance/InheritanceAlert";
import OverriddenNotification from "../inheritance/OverriddenNotification";

export function Inline({
  title,
  value,
  error,
  help,
  toggleValue,
  parentItemClass,
  permissivenessType,
}: PermissivenessInputProps) {
  const permissivenessOptions =
    permissivenessType ===
    State.ChildUpdatePropagationPermissivenessType
      .ChildUpdatePropagationPermissiveness
      ? [
          State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness,
          State.ChildUpdatePropagationPermissivenessType
            .BuilderMustBeHolderPermissiveness,
          State.ChildUpdatePropagationPermissivenessType
            .ChildUpdatePropagationPermissiveness,
          State.ChildUpdatePropagationPermissivenessType
            .ChildrenMustBeEditionsPermissiveness,
          State.ChildUpdatePropagationPermissivenessType.Components,
          State.ChildUpdatePropagationPermissivenessType
            .FreeBuildPermissiveness,
          State.ChildUpdatePropagationPermissivenessType.Namespaces,
          State.ChildUpdatePropagationPermissivenessType.StakingPermissiveness,
          State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness,
          State.ChildUpdatePropagationPermissivenessType.Usages,
        ]
      : parentItemClass
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
  const { parentValue = undefined, overridden = false } =
    parentItemClass && permissivenessType
      ? getParentItemClassProperties(parentItemClass, permissivenessType)
      : {};
  const mappedOptions = getOptions(permissivenessOptions, permissivenessType);
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
              key={`checkbox-permissiveness-${option.value}`}
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
          <OverriddenNotification />
        )}
      </Block>
    </FormControlBlock>
  );
}

export function Formik(
  props: Omit<PermissivenessInputProps, "toggleValue" | "value"> & {
    value: PermissivenessOption["value"][];
    singular?: boolean;
  }
) {
  const { setFieldValue } = useFormikContext();
  const toggleValue = (value: PermissivenessOption["value"]) => {
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
  transfromToValue,
  transformFromValueToItemClassPermissiveness,
  transformFromValueToItemClassChildUpdatePropagation,
};
export type { PermissivenessArray };
