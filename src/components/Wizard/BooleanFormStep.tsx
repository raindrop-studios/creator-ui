import { useState } from "react";
import { SubStepProps } from "./FormStep";
import { FormBlock, SubmitButton } from "./Form";
import { RadioInput } from "./Inputs";
import {
  getBooleanFromString,
  getStringFromBoolean,
} from "./Inputs/Radio";

const BooleanFormStep = ({ handleSubmit, title, help, initialValue }: BooleanFormStepProps) => {
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
        value={getStringFromBoolean(initialValue)}
      />
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

interface BooleanFormStepProps extends Omit<SubStepProps, 'data'> {
  title: string;
  help?: string;
  initialValue?: boolean | undefined;
}

export {BooleanFormStep}
