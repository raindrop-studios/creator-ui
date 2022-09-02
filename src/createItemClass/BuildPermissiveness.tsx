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
import {
  getInheritedBooleanValue,
  getParentState,
} from "../components/Wizard/Inputs/inheritance/utils";

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
    ? PermissivenessInput.transfromToValue(
        parentBuildPermissiveness,
        State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness
      )
    : undefined;
  const {
    parentValue: builderMustBeHolderParentValue,
    overridden: builderMustBeHolderOverridden,
  } = getParentState(
    State.ChildUpdatePropagationPermissivenessType
      .BuilderMustBeHolderPermissiveness,
    parentItemClass
  );
  type TValues = Omit<yup.InferType<typeof schema>, "value"> & {
    value?: (keyof State.AnchorPermissivenessType)[];
  };
  return (
    <Formik
      initialValues={{
        buildPermissiveness: data?.buildPermissiveness || parentValue,
        builderMustBeHolder: getStringFromBoolean(
          data?.builderMustBeHolder || builderMustBeHolderParentValue
        ),
      }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        const builderMustBeHolder = getBooleanFromString(
          values.builderMustBeHolder
        );
        const builderMustBeHolderInheritedBoolean = getInheritedBooleanValue(
          builderMustBeHolder || false,
          builderMustBeHolderParentValue,
          builderMustBeHolderOverridden
        );
        handleSubmit({
          ...values,
          builderMustBeHolder,
          builderMustBeHolder_inheritedboolean:
            builderMustBeHolderInheritedBoolean,
          buildPermissiveness_array:
            PermissivenessInput.transformFromValueToItemClassPermissiveness(
              values.buildPermissiveness as (keyof State.AnchorPermissivenessType)[],
              State.ChildUpdatePropagationPermissivenessType
                .BuildPermissiveness,
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
          <RadioInput.InheritedBoolean
            name="builderMustBeHolder"
            title={`Does the builder of ${
              data?.name || "your item"
            } also need to be holding the NFT for that new item at time of build?`}
            value={props.values.builderMustBeHolder}
            parentValue={builderMustBeHolderParentValue}
            overridden={builderMustBeHolderOverridden}
            trueValue="true"
            falseValue="false"
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
