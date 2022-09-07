import { State } from "@raindrops-protocol/raindrops";
import * as yup from "yup";
import { getInheritanceState } from "../inheritance/utils";
import {
  ChildUpdatePropagationPermissivenessOptions,
  PermissivenessOptions,
} from "./constants";
import {
  AnchorChildUpdatePropagationPermissivenessType,
  ChildUpdatePropagationPermissivenessArray,
  PermissivenessArray,
  PermissivenessInputProps,
  PermissivenessOption,
} from "./types";

export const getPermissivenessSettings = (
  parentItemClass: State.Item.ItemClass,
  permissivenessType: State.ChildUpdatePropagationPermissivenessType
) => {
  switch (permissivenessType) {
    case State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness:
      return parentItemClass?.itemClassData?.settings?.buildPermissiveness;
    case State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness:
      return parentItemClass?.itemClassData?.settings?.updatePermissiveness;
    default:
      console.warn("Could not find permissiveness for", permissivenessType);
      return;
  }
};

export const getParentItemClassProperties = (
  parentItemClass: State.Item.ItemClass,
  permissivenessType: State.ChildUpdatePropagationPermissivenessType
) => {
  const parentPermissiveness = getPermissivenessSettings(
    parentItemClass,
    permissivenessType
  );
  const parentValue = parentPermissiveness
    ? transfromToValue(parentPermissiveness, permissivenessType)
    : undefined;
  const propagationSetting =
    parentItemClass?.itemClassData?.settings?.childUpdatePropagationPermissiveness?.find(
      ({ childUpdatePropagationPermissivenessType }) =>
        childUpdatePropagationPermissivenessType === permissivenessType
    );
  const overridden =
    propagationSetting?.overridable === undefined
      ? false
      : !propagationSetting?.overridable;
  return { parentValue, overridden };
};

export const isOptionChecked = (
  value: PermissivenessInputProps["value"],
  option: PermissivenessOption
) => (value ? value.includes(option.value) : false);

export const getInheritanceStatus = (
  value: PermissivenessInputProps["value"],
  parentValue: PermissivenessInputProps["value"],
  option: PermissivenessOption
) => {
  const parentHasValueForOption = (parentValue || []).includes(option?.value);
  const currentValue = isOptionChecked(value, option);
  return getInheritanceState(currentValue, parentHasValueForOption || undefined);
};

export const validation = yup.array(
  yup
    .string()
    .defined()
    .oneOf([
      ...Object.values(PermissivenessOptions).map(
        ({ value }) => value as keyof State.AnchorPermissivenessType
      ),
      ...Object.values(ChildUpdatePropagationPermissivenessOptions).map(
        ({ value }) =>
          value as keyof AnchorChildUpdatePropagationPermissivenessType
      ),
    ])
);

export const getOptions = (
  options:
    | State.ChildUpdatePropagationPermissivenessType[]
    | State.PermissivenessType[],
  permissivenessType: State.ChildUpdatePropagationPermissivenessType
) => {
  switch (permissivenessType) {
    case State.ChildUpdatePropagationPermissivenessType
      .ChildUpdatePropagationPermissiveness:
      return options.map(
        (key) => ChildUpdatePropagationPermissivenessOptions[key]
      );
    default:
      return options.map((key) => PermissivenessOptions[key]);
  }
};

export const transfromToValue = (
  permissivenessData:
    | State.Permissiveness[]
    | State.ChildUpdatePropagationPermissiveness[],
  permissivenessType: State.ChildUpdatePropagationPermissivenessType
) => {
  switch (permissivenessType) {
    case State.ChildUpdatePropagationPermissivenessType
      .ChildUpdatePropagationPermissiveness:
      return transfromFromItemClassChildUpdatePropagationToValue(
        permissivenessData as State.ChildUpdatePropagationPermissiveness[]
      );
    default:
      return transfromFromItemClassPermissivenessToValue(
        permissivenessData as State.Permissiveness[]
      );
  }
};

export const transfromFromItemClassPermissivenessToValue = (
  permissivenessData: State.Permissiveness[]
): PermissivenessInputProps["value"] =>
  permissivenessData.map(
    ({ permissivenessType }) =>
      Object.keys(
        State.toAnchor(permissivenessType, State.PermissivenessType)
      )?.[0] as keyof State.AnchorPermissivenessType
  );

export const transfromFromItemClassChildUpdatePropagationToValue = (
  permissivenessData: State.ChildUpdatePropagationPermissiveness[]
): PermissivenessInputProps["value"] =>
  permissivenessData.map(
    ({ childUpdatePropagationPermissivenessType }) =>
      Object.keys(
        State.toAnchor(
          childUpdatePropagationPermissivenessType,
          State.ChildUpdatePropagationPermissivenessType
        )
      )?.[0] as keyof State.AnchorPermissivenessType
  );

export const transformFromValueToItemClassPermissiveness = (
  values: PermissivenessInputProps["value"],
  permissivenessType: State.ChildUpdatePropagationPermissivenessType,
  parentItemClass?: State.Item.ItemClass
): PermissivenessArray => {
  const { parentValue = undefined, overridden = false } = parentItemClass
    ? getParentItemClassProperties(parentItemClass, permissivenessType)
    : {};
  return (values || []).map((permissivenessKey) => ({
    permissivenessType: { [permissivenessKey]: true },
    inherited: State.toAnchor(
      overridden
        ? State.InheritanceState.Overridden
        : parentValue
        ? parentValue?.includes(permissivenessKey)
          ? State.InheritanceState.Inherited
          : State.InheritanceState.NotInherited
        : State.InheritanceState.NotInherited,
      State.InheritanceState
    ),
  }));
};

export const transformFromValueToItemClassChildUpdatePropagation = (
  values: PermissivenessInputProps["value"],
  permissivenessType: State.ChildUpdatePropagationPermissivenessType,
  parentItemClass?: State.Item.ItemClass
): ChildUpdatePropagationPermissivenessArray => {
  const { parentValue = undefined, overridden = false } = parentItemClass
    ? getParentItemClassProperties(parentItemClass, permissivenessType)
    : {};
  return (values || []).map((permissivenessKey) => ({
    childUpdatePropagationPermissivenessType: { [permissivenessKey]: true },
    inherited: State.toAnchor(
      overridden
        ? State.InheritanceState.Overridden
        : parentValue
        ? parentValue?.includes(permissivenessKey)
          ? State.InheritanceState.Inherited
          : State.InheritanceState.NotInherited
        : State.InheritanceState.NotInherited,
      State.InheritanceState
    ),
  }));
};
