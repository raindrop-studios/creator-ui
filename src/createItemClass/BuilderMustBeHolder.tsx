import { SubStepProps } from "../components/Wizard/FormStep";
import { BooleanFormStep } from "../components/Wizard/BooleanFormStep";

const BuilderMustBeHolder = ({ handleSubmit, data }: SubStepProps) => {
  const submitHandler = (value: string) =>
    handleSubmit({ builderMustBeHolder: value });
  return (
    <BooleanFormStep
      title={`Do you need to hold ${data?.mint} to build ${
        data?.name || "your item"
      }?`}
      initialValue={data?.builderMustBeHolder}
      handleSubmit={submitHandler}
    />
  );
};

const title = "Who can build?";
const hash = "builder-must-be-holder";

export { BuilderMustBeHolder as Component, title, hash };
