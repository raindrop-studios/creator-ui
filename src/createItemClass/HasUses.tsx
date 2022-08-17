import { SubStepProps } from "../components/Wizard/FormStep"
import { BooleanFormStep } from "../components/Wizard/BooleanFormStep";

const HasUses = ({handleSubmit, data}: SubStepProps) => {
  const submitHandler = (value: string) => handleSubmit({ hasUses: value });
  return (
    <BooleanFormStep
      title={`Does ${data?.name || "your item"} have any uses?`}
      help="How do players interact with this item? Or is it instead a collectible?"
      initialValue={data?.hasUses}
      handleSubmit={submitHandler}
    />
  );
}

const title = "Has uses?"
const hash = "has-uses"

export {
    HasUses as Component,
    title,
    hash,
}