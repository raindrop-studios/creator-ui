import { Alert } from "baseui/icon";
import { LabelXSmall } from "baseui/typography";
import { InheritanceState } from "./constants";

function InheritanceAlert({
  inheritanceState,
}: {
  inheritanceState: InheritanceState;
}) {
  const getInheritanceText = (
    state: InheritanceState
  ) => {
    switch (state) {
      case InheritanceState.Inherited:
        return "Inherited from parent";
      case InheritanceState.ChangedFromInherited:
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