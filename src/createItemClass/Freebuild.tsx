import { SubStepProps } from "../components/Wizard/FormStep"
import { RadioInput } from "../components/Wizard/Inputs";
import { useState } from "react";
import { FormBlock, SubmitButton } from "../components/Wizard/Form";
import { getBooleanFromString, getStringFromBoolean } from "../components/Wizard/Inputs/Radio";

const Freebuild = ({handleSubmit, data}: SubStepProps) => {
    const [submitDisabled, setSubmitDisabled] = useState<boolean>(data?.freeBuild === undefined)
    const handleSelect = (value: string) => {handleSubmit({freeBuild: getBooleanFromString(value)})};
    const handleDeselect = () => setSubmitDisabled(true);
    return (
      <FormBlock>
        <RadioInput.Standalone
          title={`Is ${
            data?.name || "your item"
          } built by combining other items?`}
          options={[
            { title: "Yes", value: "true" },
            { title: "No", value: "false" },
          ]}
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          help="An item might require components or ingredients to build. For example, to build a flaming torch you'll need a stick, some cotton, and fire."
          value={getStringFromBoolean(data?.freeBuild)}
        />
        <SubmitButton
          type="button"
          onClick={() => handleSubmit(data?.freeBuild)}
          isLoading={false}
          disabled={submitDisabled}
        >
          Next
        </SubmitButton>
      </FormBlock>
    );
}

const title = "Has components?"
const hash = "freebuild"

export {
    Freebuild as Component,
    title,
    hash,
}