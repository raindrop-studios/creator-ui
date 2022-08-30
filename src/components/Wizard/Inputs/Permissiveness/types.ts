import { State } from "@raindrops-protocol/raindrops";
import { InputProps } from "../common";

export type PermissivenessArray = {
  inherited: State.InheritedBoolean;
  permissivenessType: State.AnchorPermissivenessType;
}[];

export interface PermissivenessInputProps
  extends Omit<InputProps, "onChange" | "onBlur"> {
  options?: State.PermissivenessType[];
  value: (keyof State.AnchorPermissivenessType)[] | undefined;
  parentItemClass?: State.Item.ItemClass;
  toggleValue: (arg: keyof State.AnchorPermissivenessType) => void;
  permissivenessType: State.ChildUpdatePropagationPermissivenessType;
}

export type PermissivenessOption = {
  title: string;
  description: string;
  value: keyof State.AnchorPermissivenessType;
};
