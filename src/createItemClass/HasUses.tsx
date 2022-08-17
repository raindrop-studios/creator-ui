import * as React from "react";
import { SubStepProps } from "../components/Wizard/FormStep"
import { RadioInput } from "../components/Wizard/Inputs";
import { useState } from "react";
import { FormBlock, SubmitButton } from "../components/Wizard/Form";
import { getBooleanFromString, getStringFromBoolean } from "../components/Wizard/Inputs/Radio";

const HasUses = ({handleSubmit, data}: SubStepProps) => {
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(data?.hasUses === undefined)
    const handleSelect = (value: string) => {handleSubmit({hasUses: getBooleanFromString(value)})};
    const handleDeselect = () => setSubmitDisabled(true);
    return (
      <FormBlock>
        <RadioInput.Standalone
          title={`Does ${data?.name || "your item"} have any uses?`}
          options={[
            { title: "Yes", value: "true" },
            { title: "No", value: "false" },
          ]}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          help="How do players interact with this item? Or is it instead a collectible?"
          value={getStringFromBoolean(data?.hasUses)}
        />
        <SubmitButton
          type="button"
          onClick={() => handleSubmit(data?.hasUses)}
          disabled={submitDisabled}
        >
          Next
        </SubmitButton>
      </FormBlock>
    );
}

const title = "Has uses?"
const hash = "has-uses"

export {
    HasUses as Component,
    title,
    hash,
}