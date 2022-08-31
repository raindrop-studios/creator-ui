import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { State } from "@raindrops-protocol/raindrops";

import { SubStepProps } from "../components/Wizard/FormStep";
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { PermissivenessInput } from "../components/Wizard/Inputs";
import { AnchorChildUpdatePropagationPermissivenessType, PermissivenessOption } from "../components/Wizard/Inputs/Permissiveness/types";

const ChildSettings = ({ handleSubmit, data }: SubStepProps) => {
  const schema = yup.object({
    childUpdatePropagationPermissiveness: PermissivenessInput.validation.default([]),
  });
  const parentItemClass: State.Item.ItemClass | undefined =
    data?.parent_itemclass;
  const parentChildSettings =
    parentItemClass?.itemClassData?.settings?.childUpdatePropagationPermissiveness;
  const parentValue = parentChildSettings
    ? PermissivenessInput.transfromToValue(
        parentChildSettings,
        State.ChildUpdatePropagationPermissivenessType.ChildUpdatePropagationPermissiveness
      )
    : undefined;
  type TValues = Omit<yup.InferType<typeof schema>, "value"> & {
    value?: PermissivenessOption['value'][];
  };
  return (
    <Formik
      initialValues={{
        childUpdatePropagationPermissiveness: data?.childUpdatePropagationPermissiveness || parentValue,
      }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit({
          ...values,
          childUpdatePropagationPermissiveness_array:
            PermissivenessInput.transformFromValueToItemClassChildUpdatePropagation(
              values.childUpdatePropagationPermissiveness as (keyof State.AnchorPermissivenessType)[],
              State.ChildUpdatePropagationPermissivenessType.ChildUpdatePropagationPermissiveness,
              parentItemClass
            ),
        });
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <PermissivenessInput.Formik
            name="childUpdatePropagationPermissiveness"
            permissivenessType={
              State.ChildUpdatePropagationPermissivenessType.ChildUpdatePropagationPermissiveness
            }
            title={`When item classes inherit from ${data?.name || "your item"} - what permissions should be locked down?`}
            help={`This determines what can be changed on item classes inheriting from ${data?.name || "your item"}`}
            value={
              props.values
                ?.childUpdatePropagationPermissiveness as (keyof AnchorChildUpdatePropagationPermissivenessType)[]
            }
            parentItemClass={parentItemClass}
            error={props.errors.childUpdatePropagationPermissiveness}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const title = "Settings for children";
const hash = "child-settings";

export { ChildSettings as Component, title, hash };
