import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { SubStepProps } from "../components/Wizard/FormStep";
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { IntegerInput } from "../components/Wizard/Inputs";
import useNextItemClassIndex from "../hooks/useNextItemClassIndex";
import { LoadingMessage } from "../components/LoadingMessage";
import { LabelSmall } from "baseui/typography";
import { useConnection } from "@solana/wallet-adapter-react";
import { getItemClassInfo } from "../hooks/utils";
import { PublicKey } from "@solana/web3.js";

const ItemClassIndex = ({ handleSubmit, data }: SubStepProps) => {
  const {connection} = useConnection()
  const { nextIndex, loading } = useNextItemClassIndex(data?.mint);
  const schema = yup.object({
    index: yup.number().min(0).required().test('indexInUse', 'This index is already in use.', async (value) => {
      if (value !== undefined) {
        const mintPublicKey = new PublicKey(data?.mint)
        const accountInfo = await getItemClassInfo(mintPublicKey, value, connection);
        if (!accountInfo) {
          return true
        }
      }
      return false
    }),
  });
  type TValues = yup.InferType<typeof schema>;
  return loading ? (
    <LoadingItemClass mint={data?.mint} />
  ) : (
    <Formik
      initialValues={{ index: data?.index || nextIndex || 0 }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit(values);
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <IntegerInput.Inline
            name="index"
            title="What index should we assign this item class too?"
            help="Indexes allow you to re-use an NFT to define multiple item classes"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.index}
            error={props.errors.index}
          />
          <LabelSmall alignSelf="center">
            First available index is: {nextIndex}
          </LabelSmall>
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const LoadingItemClass = ({ mint }: { mint: string }) => (
  <LoadingMessage
    message={`Checking if there are existing item classes for ${mint}`}
  />
);

const title = "Select an index";
const hash = "index";

export { ItemClassIndex as Component, title, hash };
