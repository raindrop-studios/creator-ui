import { useWallet } from "@solana/wallet-adapter-react";
import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { FormikSubmitButton, Form } from "../components/Wizard/Form";
import { SubStepProps } from "../components/Wizard/FormStep";
import { PublicKeyInput } from "../components/Wizard/Inputs";

const MetadataUpdateAuthority = ({ handleSubmit, data }: SubStepProps) => {
  const {publicKey} = useWallet()
  const schema = yup.object({
    metadataUpdateAuthority: PublicKeyInput.validation.required(),
  });
  type TValues = yup.InferType<typeof schema>;
  return (
    <Formik
      initialValues={{
        metadataUpdateAuthority: data?.metadataUpdateAuthority || publicKey,
      }}
      validationSchema={schema}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit(values);
        actions.setSubmitting(false);
      }}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <PublicKeyInput.Formik
            name="metadataUpdateAuthority"
            title="Who can update this item class?"
            help="Enter the public key here"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.metadataUpdateAuthority}
            error={props.errors.metadataUpdateAuthority}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};


const title = "Update authority";
const hash = "metadata-update-authority";

export {MetadataUpdateAuthority as Component, title, hash}