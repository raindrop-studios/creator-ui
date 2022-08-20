import React from "react";
import { SubStepProps } from "../components/Wizard/FormStep";
import { BooleanFormStep } from "../components/Wizard/BooleanFormStep";

const ChildrenMustBeEditions = ({ handleSubmit, data }: SubStepProps) => {
  const submitHandler = (value: string) => handleSubmit({ childrenMustBeEditions: value });
  return (
    <BooleanFormStep
      title={`Should item classes based on ${
        data?.name || "your item"
      } be built with editions of ${data?.mint} only?`}
      initialValue={data?.childrenMustBeEditions}
      handleSubmit={submitHandler}
    />
  );
};

const title = "Limit to editions";
const hash = "children-must-be-editions";

export { ChildrenMustBeEditions as Component, title, hash };
