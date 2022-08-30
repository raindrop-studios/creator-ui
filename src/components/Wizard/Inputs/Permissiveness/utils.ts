import { State } from "@raindrops-protocol/raindrops";
import * as yup from "yup";
import { ChangedFromInherited, PermissivenessOptions } from "./constants";
import { PermissivenessInputProps, PermissivenessOption } from "./types";

export const getPermissivenessSettings = (
  parentItemClass?: State.Item.ItemClass,
  permissivenessType?: State.ChildUpdatePropagationPermissivenessType,
) => {
  switch (permissivenessType) {
    case State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness:
      return parentItemClass?.itemClassData?.settings?.buildPermissiveness;
    case State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness:
      return parentItemClass?.itemClassData?.settings?.updatePermissiveness;
    default:
      console.warn("Could not find permissiveness for", permissivenessType)
      return 
  }
}

export const getParentItemClassProperties = (
  parentItemClass?: State.Item.ItemClass,
  permissivenessType?: State.ChildUpdatePropagationPermissivenessType,
) => {
  const parentPermissiveness = getPermissivenessSettings(parentItemClass, permissivenessType);
  const parentValue = parentPermissiveness
    ? transfromFromItemClassToValue(parentPermissiveness)
    : undefined;
  const propagationSetting =
    parentItemClass?.itemClassData?.settings?.childUpdatePropagationPermissiveness?.find(
      ({ childUpdatePropagationPermissivenessType }) =>
        childUpdatePropagationPermissivenessType ===
        permissivenessType
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
  if (parentHasValueForOption) {
    if (isOptionChecked(value, option)) {
      return State.InheritanceState.Inherited;
    }
    return ChangedFromInherited;
  }
  return State.InheritanceState.NotInherited;
};

export const validation = yup.array(
  yup
    .string()
    .defined()
    .oneOf(
      Object.values(PermissivenessOptions).map(
        ({ value }) => value as keyof State.AnchorPermissivenessType
      )
    )
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

export type PermissivenessArray = {
  inherited: State.InheritedBoolean;
  permissivenessType: State.AnchorPermissivenessType;
}[];

export const transformFromValueToItemClass = (
  values: (keyof State.AnchorPermissivenessType)[],
  parentItemClass?: State.Item.ItemClass,
  permissivenessType?: State.ChildUpdatePropagationPermissivenessType
): PermissivenessArray => {
  const { parentValue, overridden } =
    getParentItemClassProperties(parentItemClass, permissivenessType);
  return values.map((permissivenessKey) => ({
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
