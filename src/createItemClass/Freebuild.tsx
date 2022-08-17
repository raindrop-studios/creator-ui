import { SubStepProps } from "../components/Wizard/FormStep"
import { BooleanFormStep } from "../components/Wizard/BooleanFormStep";

const Freebuild = ({handleSubmit, data}: SubStepProps) => {
  const submitHandler = (value: string) =>  handleSubmit({ freeBuild: value });
  return (
    <BooleanFormStep
        title={`Is ${
            data?.name || "your item"
          } built by combining other items?`}
        help="An item might require components or ingredients to build. For example, to build a flaming torch you'll need a stick, some cotton, and fire."
        initialValue={data?.freeBuild}
        handleSubmit={submitHandler}
      />
  );
};

const title = "Has components?"
const hash = "freebuild"

export {
    Freebuild as Component,
    title,
    hash,
}