import React, { useEffect } from "react";
import { KIND as NOTIFICATION_KIND, Notification } from "baseui/notification";
import { StyledLink } from "baseui/link";
import { SubStepProps } from "../components/Wizard/FormStep";
import { JSONInput } from "../components/Wizard/Inputs";
import { FormBlock, SubmitButton } from "../components/Wizard/Form";
import { LoadingMessage } from "../components/LoadingMessage";
import useCreateItemClass from "../hooks/useCreateItemClass";

const ReviewData = ({ clean, data }: SubStepProps & { clean?: Function }) => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [cleanedData, setCleanedData] = React.useState<any>();
  const {
    createItemClass,
    success,
    error,
    transactionUrl,
    loading: creatingItemClass,
  } = useCreateItemClass();
  useEffect(() => {
    if (clean) {
      setLoading(true);
      cleanData(clean, data, (output: any) => {
        setCleanedData(output);
        setLoading(false);
      });
    }
  }, [data, clean]);
  const submit = () => {
    createItemClass({ config: cleanedData || data });
  };
  const notificationOverrrides = {Body: {style: {alignSelf: 'center', width: 'auto'}}}
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
      {success && (
        <Notification kind={NOTIFICATION_KIND.positive} overrides={notificationOverrrides}>
          <>
            Item class transaction:{" "}
            <StyledLink href={transactionUrl} target="_blank">
              View on explorer
            </StyledLink>
          </>
        </Notification>
      )}
      {error && (
        <Notification kind={NOTIFICATION_KIND.negative} overrides={notificationOverrrides}>
          <>Item class could not be created: {error.message}</>
        </Notification>
      )}
      <SubmitButton onClick={submit} disabled={creatingItemClass || !!error}>
        Complete
      </SubmitButton>
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
