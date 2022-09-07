import { State } from "@raindrops-protocol/raindrops";
import { InputProps } from "../common";

export type PermissivenessArray = {
  inherited: State.InheritedBoolean;
  permissivenessType: State.AnchorPermissivenessType;
}[];

export type ChildUpdatePropagationPermissivenessArray = {
  inherited: State.InheritedBoolean;
  childUpdatePropagationPermissivenessType: State.AnchorPermissivenessType;
}[];

export interface PermissivenessInputProps
  extends Omit<InputProps, "onChange" | "onBlur"> {
  options?: (
    | State.PermissivenessType
    | State.ChildUpdatePropagationPermissivenessType
  )[];
  value: PermissivenessOption["value"][] | undefined;
  parentItemClass?: State.Item.ItemClass;
  toggleValue: (arg: PermissivenessOption["value"]) => void;
  permissivenessType: State.ChildUpdatePropagationPermissivenessType;
}
export interface AnchorChildUpdatePropagationPermissivenessType {
  buildPermissiveness?: boolean;
  updatePermissiveness?: boolean;
  usages?: boolean;
  components?: boolean;
  childUpdatePropagationPermissiveness?: boolean;
  childrenMustBeEditionsPermissiveness?: boolean;
  builderMustBeHolderPermissiveness?: boolean;
  stakingPermissiveness?: boolean;
  namespaces?: boolean;
  freeBuildPermissiveness?: boolean;
}

export type PermissivenessOption = {
  title: string;
  description: string;
  value:
    | keyof State.AnchorPermissivenessType
    | keyof AnchorChildUpdatePropagationPermissivenessType;
};
