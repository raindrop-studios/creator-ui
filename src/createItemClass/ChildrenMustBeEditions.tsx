import React from "react";
import { State } from "@raindrops-protocol/raindrops";
import { SubStepProps } from "../components/Wizard/FormStep";
import { InheritedBooleanFormStep } from "../components/Wizard/BooleanFormStep";

const ChildrenMustBeEditions = ({ handleSubmit, data }: SubStepProps) => {
  const submitHandler = ({
    value,
    inheritedBoolean,
  }: {
    value: boolean;
    inheritedBoolean: State.InheritedBoolean;
  }) =>
    handleSubmit({
      childrenMustBeEditions: value,
      childrenMustBeEditions_inheritedboolean: inheritedBoolean,
    });
  return (
    <InheritedBooleanFormStep
      title={`Should item classes based on ${
        data?.name || "your item"
      } be built with editions of ${data?.mint} only?`}
      initialValue={data?.childrenMustBeEditions}
      parentItemClass={data?.parent_itemclass}
      permissivenessType={
        State.ChildUpdatePropagationPermissivenessType
          .ChildrenMustBeEditionsPermissiveness
      }
      handleSubmit={submitHandler}
    />
  );
};

const title = "Limit to editions";
const hash = "children-must-be-editions";

export { ChildrenMustBeEditions as Component, title, hash };
