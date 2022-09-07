import { State } from "@raindrops-protocol/raindrops";
import { InheritanceState } from "./constants";

export const getInheritanceState = (
  value: boolean,
  parentValue: boolean | undefined
) => {
  if (parentValue !== undefined) {
    if (value === parentValue) {
      return InheritanceState.Inherited;
    }
    return InheritanceState.ChangedFromInherited;
  }
  return InheritanceState.NotInherited;
};

export type InheritedBooleanPermissivenessTypes =
  | State.ChildUpdatePropagationPermissivenessType.BuilderMustBeHolderPermissiveness
  | State.ChildUpdatePropagationPermissivenessType.ChildrenMustBeEditionsPermissiveness
  | State.ChildUpdatePropagationPermissivenessType.FreeBuildPermissiveness;

export const getItemClassValue = (
  itemClass: State.Item.ItemClass,
  permissivenessType: State.ChildUpdatePropagationPermissivenessType
) => {
  switch (permissivenessType) {
    case State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness:
      return itemClass?.itemClassData?.settings?.buildPermissiveness;
    case State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness:
      return itemClass?.itemClassData?.settings?.updatePermissiveness;
    case State.ChildUpdatePropagationPermissivenessType
      .BuilderMustBeHolderPermissiveness:
      return itemClass?.itemClassData?.settings?.builderMustBeHolder;
    case State.ChildUpdatePropagationPermissivenessType
      .ChildrenMustBeEditionsPermissiveness:
      return itemClass?.itemClassData?.settings?.childrenMustBeEditions;
    case State.ChildUpdatePropagationPermissivenessType
      .ChildUpdatePropagationPermissiveness:
      return itemClass?.itemClassData?.settings
        ?.childUpdatePropagationPermissiveness;
    case State.ChildUpdatePropagationPermissivenessType.FreeBuildPermissiveness:
      return itemClass?.itemClassData?.settings?.freeBuild;
    case State.ChildUpdatePropagationPermissivenessType.StakingPermissiveness:
      return itemClass?.itemClassData?.settings?.stakingPermissiveness;
    case State.ChildUpdatePropagationPermissivenessType.Components:
      return itemClass?.itemClassData?.config?.components;
    case State.ChildUpdatePropagationPermissivenessType.Usages:
      return itemClass?.itemClassData?.config?.usages;
    case State.ChildUpdatePropagationPermissivenessType.Namespaces:
      return itemClass?.namespaces;
    default:
      console.warn("Could not find value for", permissivenessType);
      return;
  }
};

export const getInheritedBooleanValue = (
  value: boolean,
  parentValue: boolean | undefined,
  overridden: boolean | undefined
): State.InheritedBoolean => ({
  inherited: State.toAnchor(overridden
    ? State.InheritanceState.Overridden
    : value === parentValue
    ? State.InheritanceState.Inherited
    : State.InheritanceState.NotInherited, State.InheritanceState),
  boolean: value,
});

export const getParentState = (
  permissivenessType: InheritedBooleanPermissivenessTypes,
  parentItemClass?: State.Item.ItemClass
) => {
  const rawParentValue = parentItemClass
    ? (getItemClassValue(
        parentItemClass,
        permissivenessType
      ) as State.InheritedBoolean)
    : undefined;
  let parentValue =
    rawParentValue !== undefined
      ? Boolean(rawParentValue?.boolean)
      : rawParentValue;
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
