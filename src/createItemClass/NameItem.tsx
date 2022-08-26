import { Formik, FormikHelpers } from "formik";
import * as yup from "yup"
import { SubStepProps } from "../components/Wizard/FormStep"
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { StringInput } from "../components/Wizard/Inputs";

const NameItem = ({handleSubmit, data}: SubStepProps) => {
    const schema = yup.object({
        itemName: yup.string()
    });
    type TValues = yup.InferType<typeof schema>;
    return (
      <Formik
        initialValues={{ itemName: data?.itemName }}
        onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
          actions.setSubmitting(true);
          handleSubmit(values);
          actions.setSubmitting(false);
        }}
        validationSchema={schema}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <StringInput.Inline
              name="itemName"
              title="What is your item called?"
              help="We'll use this to refer to the item throughout the flow"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.itemName}
              error={props.errors.itemName}
            />
            <FormikSubmitButton>Next</FormikSubmitButton>
          </Form>
        )}
      </Formik>
    );
}

const title = "Name your item"
const hash = "name"

export {
    NameItem as Component,
    title,
    hash,
}