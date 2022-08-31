import { Formik, FormikHelpers } from "formik";
import * as yup from "yup"
import { SubStepProps } from "../components/Wizard/FormStep"
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { RadioInput } from "../components/Wizard/Inputs";
import { getBooleanFromString, getStringFromBoolean } from "../components/Wizard/Inputs/Radio";

const HasParent = ({handleSubmit, data}: SubStepProps) => {
    const schema = yup.object({
        hasParent: yup.string().oneOf(["true", "false"]).required()
    });
    type TValues = yup.InferType<typeof schema>;
    return (
      <Formik
        initialValues={{ hasParent: getStringFromBoolean(data?.hasParent) }}
        onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
          actions.setSubmitting(true);
          handleSubmit({hasParent: getBooleanFromString(values?.hasParent)});
          actions.setSubmitting(false);
        }}
        validationSchema={schema}
      >
        {(props) => (
          <Form onSubmit={props.handleSubmit}>
            <RadioInput.Inline
              name="hasParent"
              title={`Should ${data?.name || "your item"} be defined...`}
              options={[
                {
                  title: "By inheriting from an existing item class",
                  value: "true",
                },
                {
                  title: "From scratch",
                  value: "false",
                },
              ]}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.hasParent}
              error={props.errors.hasParent}
            />
            <FormikSubmitButton>Next</FormikSubmitButton>
          </Form>
        )}
      </Formik>
    );
}

const title = "Inherit?"
const hash = "has-parent"

export {
    HasParent as Component,
    title,
    hash,
}