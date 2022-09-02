import { useState } from "react";
import { State } from "@raindrops-protocol/raindrops";
import { SubStepProps } from "./FormStep";
import { FormBlock, SubmitButton } from "./Form";
import { RadioInput } from "./Inputs";
import { getBooleanFromString, getStringFromBoolean } from "./Inputs/Radio";
import {
  getInheritanceState,
  getInheritedBooleanValue,
  getParentState,
  InheritedBooleanPermissivenessTypes,
} from "./Inputs/inheritance/utils";
import OverriddenNotification from "./Inputs/inheritance/OverriddenNotification";
import InheritanceAlert from "./Inputs/inheritance/InheritanceAlert";

const BooleanFormStep = ({
  handleSubmit,
  title,
  help,
  initialValue,
  disabled,
  children,
}: BooleanFormStepProps) => {
  const [submitDisabled, setSubmitDisabled] = useState<boolean>(
    initialValue === undefined
  );
  const handleSelect = (value: string) => {
    handleSubmit(getBooleanFromString(value));
  };
  const handleDeselect = () => setSubmitDisabled(true);
  return (
    <FormBlock>
      <RadioInput.Standalone
        title={title}
        options={[
          { title: "Yes", value: "true" },
          { title: "No", value: "false" },
        ]}
        onSelect={handleSelect}
        onDeselect={handleDeselect}
        help={help}
        disabled={disabled}
        value={getStringFromBoolean(initialValue)}
      />
      {children}
      <SubmitButton
        type="button"
        onClick={() => handleSubmit(initialValue)}
        disabled={submitDisabled}
      >
        Next
      </SubmitButton>
    </FormBlock>
  );
};

interface BooleanFormStepProps
  extends Omit<SubStepProps, "data" | "handleSubmit"> {
  title: string;
  help?: string;
  initialValue?: boolean | undefined;
  disabled?: boolean;
  handleSubmit: (arg: boolean | undefined) => void;
  children?: React.ReactNode;
}

interface InheritedBooleanFormStepProps
  extends Omit<BooleanFormStepProps, "handleSubmit"> {
  parentItemClass: State.Item.ItemClass;
  permissivenessType: InheritedBooleanPermissivenessTypes;
  handleSubmit: ({
    value,
    inheritedBoolean,
  }: {
    value: boolean;
    inheritedBoolean: State.InheritedBoolean;
  }) => void;
}

const InheritedBooleanFormStep = ({
  parentItemClass,
  permissivenessType,
  handleSubmit,
  initialValue,
  ...props
}: InheritedBooleanFormStepProps) => {
  const { parentValue, overridden } = getParentState(
    permissivenessType,
    parentItemClass
  );
  const inheritanceState = getInheritanceState(
    initialValue || false,
    parentValue
  );
  const submitHandler = (value: boolean | undefined) =>
    handleSubmit({
      value: value || false,
      inheritedBoolean: getInheritedBooleanValue(
        value || false,
        parentValue,
        overridden
      ),
    });
  return (
    <BooleanFormStep
      {...props}
      initialValue={initialValue || parentValue}
      disabled={overridden}
      handleSubmit={submitHandler}
    >
      {overridden ? (
        <OverriddenNotification />
      ) : (
        <InheritanceAlert inheritanceState={inheritanceState} />
      )}
    </BooleanFormStep>
  );
};

export { BooleanFormStep, InheritedBooleanFormStep };
