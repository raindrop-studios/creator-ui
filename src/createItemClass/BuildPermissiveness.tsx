import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { State } from "@raindrops-protocol/raindrops";

import {
  getBooleanFromString,
  getStringFromBoolean,
} from "../components/Wizard/Inputs/Radio";
import { SubStepProps } from "../components/Wizard/FormStep";
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import { PermissivenessInput, RadioInput } from "../components/Wizard/Inputs";

const BuildPermissiveness = ({ handleSubmit, data }: SubStepProps) => {
  const schema = yup.object({
    buildPermissiveness: PermissivenessInput.validation.default([]),
    builderMustBeHolder: yup.string().required().oneOf(["true", "false"]),
  });
  const parentItemClass: State.Item.ItemClass | undefined =
    data?.parent_itemclass;
  const parentBuildPermissiveness =
    parentItemClass?.itemClassData?.settings?.buildPermissiveness;
  const parentValue = parentBuildPermissiveness
    ? PermissivenessInput.transfromFromItemClassToValue(
        parentBuildPermissiveness
      )
    : undefined;
  type TValues = Omit<yup.InferType<typeof schema>, "value"> & {
    value?: (keyof State.AnchorPermissivenessType)[];
  };
  return (
    <Formik
      initialValues={{
        buildPermissiveness: data?.buildPermissiveness || parentValue,
        builderMustBeHolder: getStringFromBoolean(data?.builderMustBeHolder),
      }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit({
          ...values,
          builderMustBeHolder: getBooleanFromString(values.builderMustBeHolder),
          buildPermissiveness_array:
            PermissivenessInput.transformFromValueToItemClass(
              values.buildPermissiveness as (keyof State.AnchorPermissivenessType)[],
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
            name="buildPermissiveness"
            permissivenessType={
              State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness
            }
            title={`Who can build ${data?.name || "your item"}?`}
            help="This determines who can craft this item, before other conditions (such as component requirements etc.) are checked"
            value={
              props.values
                ?.buildPermissiveness as (keyof State.AnchorPermissivenessType)[]
            }
            parentItemClass={parentItemClass}
            error={props.errors.buildPermissiveness}
          />
          <RadioInput.Inline
            name="builderMustBeHolder"
            title={`Does the builder of ${
              data?.name || "your item"
            } also need to be holding the NFT for that new item at time of build?`}
            value={props.values.builderMustBeHolder}
            error={props.errors.builderMustBeHolder}
            options={[
              { title: "Yes", value: "true" },
              { title: "No", value: "false" },
            ]}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const title = "Who can build?";
const hash = "build-permissiveness";

export { BuildPermissiveness as Component, title, hash };
