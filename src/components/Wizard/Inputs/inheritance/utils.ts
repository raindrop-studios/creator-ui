import { InheritanceState } from "./constants";

export const getInheritanceState = (
  value: boolean,
  parentValue: boolean | undefined
) => {
  if (parentValue) {
    if (value === parentValue) {
      return InheritanceState.Inherited;
    }
    return InheritanceState.ChangedFromInherited;
  }
  return InheritanceState.NotInherited;
};
