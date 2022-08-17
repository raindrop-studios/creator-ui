import React, { useEffect } from "react";
import { SubStepProps } from "../components/Wizard/FormStep";
import { JSONInput } from "../components/Wizard/Inputs";
import { FormBlock, SubmitButton } from "../components/Wizard/Form";
import { LoadingMessage } from "../components/LoadingMessage";

const ReviewData = ({
  handleSubmit,
  clean,
  data,
}: SubStepProps & { clean?: Function }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [cleanedData, setCleanedData] = React.useState<any>();
  useEffect(() => {
    if (clean) {
      setLoading(true);
      cleanData(clean, data, (output: any) => {
        setCleanedData(output);
        setLoading(false);
      });
    }
  }, [data, clean]);
  const submit = () => handleSubmit({ ...data, _cleaned: cleanedData || data });
  return (
    <FormBlock>
      {!loading && (!clean || cleanedData) ? (
        <JSONInput.Display
          name="review"
          title="Review your item class config"
          value={cleanedData || data}
          disabled
        />
      ) : (
        <LoadingMessage message="Preparing data..." />
      )}
      <SubmitButton onClick={submit}>Complete</SubmitButton>
    </FormBlock>
  );
};

async function cleanData(
  clean: Function,
  data: object,
  setCleanedData: Function
) {
  const cleanedData = await clean(data);
  setCleanedData(cleanedData);
}

const title = "Review";
const hash = "review";

export { ReviewData as Component, title, hash };
