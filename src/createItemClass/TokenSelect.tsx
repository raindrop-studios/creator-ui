import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { SubStepProps } from "../components/Wizard/FormStep";
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { TokenInput } from "../components/Wizard/Inputs";
import { TokenInputProps } from "../components/Wizard/Inputs/Token";

const TokenSelect = ({
  handleSubmit,
  data,
  name,
  inputTitle,
  help,
}: SubStepProps & {
  name: TokenInputProps["name"];
  inputTitle?: TokenInputProps["title"];
  help?: TokenInputProps["help"];
}) => {
  const schema = yup.object({
    [name]: yup.string().required(),
  });
  type TValues = yup.InferType<typeof schema>;
  return (
    <Formik
      initialValues={{ [name]: data?.[name] }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit(values);
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <TokenInput.Formik
            name={name}
            title={
              inputTitle || `Select an NFT to base ${data?.name || "your item"} on`
            }
            help={help || "This forms the basis of the item that will be built"}
            value={props.values?.[name]}
            error={props.errors?.[name]}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const title = "Select NFT";
const hash = "select-nft-mint";

export { TokenSelect as Component, title, hash };
