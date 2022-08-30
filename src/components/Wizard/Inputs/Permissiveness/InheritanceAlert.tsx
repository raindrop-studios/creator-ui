import { State } from "@raindrops-protocol/raindrops";
import { Alert } from "baseui/icon";
import { LabelXSmall } from "baseui/typography";
import { ChangedFromInherited } from "./constants";

function InheritanceAlert({
  inheritanceState,
}: {
  inheritanceState:
    | State.InheritanceState.Inherited
    | State.InheritanceState.NotInherited
    | typeof ChangedFromInherited;
}) {
  const getInheritanceText = (
    state:
      | State.InheritanceState.Inherited
      | State.InheritanceState.NotInherited
      | typeof ChangedFromInherited
  ) => {
    switch (state) {
      case State.InheritanceState.Inherited:
        return "Inherited from parent";
      case ChangedFromInherited:
        return (
          <>
            <Alert overrides={{ Svg: { style: { marginRight: "5px" } } }} />
            Changed from inherited value
          </>
        );
      default:
        return "";
    }
  };
  return (
    <LabelXSmall $style={{ marginTop: "20px", display: "flex" }}>
      {getInheritanceText(inheritanceState)}
    </LabelXSmall>
  );
}

export default InheritanceAlert;