import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { SubStepProps } from "../components/Wizard/FormStep";
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { ItemClassKeyInput, PublicKeyInput } from "../components/Wizard/Inputs";
import { InheritedProperties } from "./constants";

const ParentItemClass = ({ handleSubmit, data }: SubStepProps) => {
  const schema = yup.object({
    parent: PublicKeyInput.validation.required(),
    parent_itemclass: yup.object({
      mint: PublicKeyInput.validation.required(
        "Selected item class does not have a mint stored"
      ),
    }),
  });
  type TValues = Omit<yup.InferType<typeof schema>, "parent_itemclass"> & {
    parent_itemclass?: any;
  };
  return (
    <Formik
      initialValues={{ parent: data?.parent, parent_itemclass: undefined }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        const clearedInheritedValues = data?.parent !== values?.parent ? Object.fromEntries(
          InheritedProperties.map((key) => [key, undefined])
        ) : {};
        handleSubmit({
          ...clearedInheritedValues,
          parent: values?.parent,
          parent_itemclass: values?.parent_itemclass,
        });
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <ItemClassKeyInput.Formik
            name="parent"
            title="Enter the key of the item class you want to inherit from"
            help="Item classes based off a parent will inherit different properties, depending on what was defined in that parent."
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.parent}
            error={props.errors.parent}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const title = "Parent item class";
const hash = "parent";

export { ParentItemClass as Component, title, hash };
