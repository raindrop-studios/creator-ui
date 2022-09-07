import { State } from "@raindrops-protocol/raindrops";
import { SubStepProps } from "../components/Wizard/FormStep";
import { InheritedBooleanFormStep } from "../components/Wizard/BooleanFormStep";

const Freebuild = ({ handleSubmit, data }: SubStepProps) => {
  const submitHandler = ({
    value,
    inheritedBoolean,
  }: {
    value: boolean;
    inheritedBoolean: State.InheritedBoolean;
  }) =>
    handleSubmit({
      freeBuild: value,
      freeBuild_inheritedboolean: inheritedBoolean,
    });
  return (
    <InheritedBooleanFormStep
      title={`Is ${data?.name || "your item"} built by combining other items?`}
      help="An item might require components or ingredients to build. For example, to build a flaming torch you'll need a stick, some cotton, and fire."
      initialValue={data?.freeBuild}
      parentItemClass={data?.parent_itemclass}
      permissivenessType={
        State.ChildUpdatePropagationPermissivenessType.FreeBuildPermissiveness
      }
      handleSubmit={submitHandler}
    />
  );
};

const title = "Has components?";
const hash = "freebuild";

export { Freebuild as Component, title, hash };
