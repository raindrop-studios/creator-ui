import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";
import { SubStepProps } from "../components/Wizard/FormStep";
import { Form, FormikSubmitButton } from "../components/Wizard/Form";
import {
  PermissivenessInput,
  PublicKeyInput,
  RadioInput,
} from "../components/Wizard/Inputs";
import { State } from "@raindrops-protocol/raindrops";
import { useWallet } from "@solana/wallet-adapter-react";

const UpdatePermissiveness = ({ handleSubmit, data }: SubStepProps) => {
  const { publicKey } = useWallet();
  const schema = yup.object({
    updatePermissiveness: PermissivenessInput.validation.default([]),
    permissivenessToUse: yup.string(),
    metadataUpdateAuthority: PublicKeyInput.validation,
  });
  const parentItemClass : State.Item.ItemClass | undefined = data?.parent_itemclass
  const parentUpdatePermissiveness =
    parentItemClass?.itemClassData?.settings?.updatePermissiveness;
  const parentValue = parentUpdatePermissiveness
    ? PermissivenessInput.transfromToValue(
        parentUpdatePermissiveness,
        State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness
      )
    : undefined;
  type TValues = yup.InferType<typeof schema>;
  return (
    <Formik
      initialValues={{
        updatePermissiveness: data?.updatePermissiveness || parentValue,
        permissivenessToUse: data?.permissivenessToUse,
        metadataUpdateAuthority: data?.metadataUpdateAuthority || publicKey,
      }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit({
          ...values,
          updatePermissiveness_array:
            PermissivenessInput.transformFromValueToItemClassPermissiveness(
              values.updatePermissiveness as (keyof State.AnchorPermissivenessType)[],
              State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness,
              parentItemClass
            ),
          permissivenessToUse:
            values?.updatePermissiveness?.length === 0
              ? undefined
              : values?.permissivenessToUse,
        });
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <PermissivenessInput.Formik
            name="updatePermissiveness"
            permissivenessType={
              State.ChildUpdatePropagationPermissivenessType.UpdatePermissiveness
            }
            title={`Who can update ${data?.name || "your item"}?`}
            help="This determines who can make updates to this item"
            value={
              props.values
                ?.updatePermissiveness as (keyof State.AnchorPermissivenessType)[]
            }
            parentItemClass={parentItemClass}
            error={props.errors.updatePermissiveness}
          />
          {props.values.updatePermissiveness?.length > 1 && (
            <RadioInput.Inline
              name="permissivenessToUse"
              title="Which permissiveness should be used to create this item class?"
              help="How do you know what to put here //QUESTION"
              options={getOptions(props.values.updatePermissiveness)}
              value={props.values.permissivenessToUse}
              error={props.errors.permissivenessToUse}
              onChange={props.handleChange}
              onBlur={props.handleBlur}
            />
          )}
          {!data?.hasParent && (
            <PublicKeyInput.Formik
              name="metadataUpdateAuthority"
              title="Who is the update authority for this item class?"
              help="Enter the public key here"
              onChange={props.handleChange}
              onBlur={props.handleBlur}
              value={props.values.metadataUpdateAuthority}
              error={props.errors.metadataUpdateAuthority}
            />
          )}
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

function getOptions(stringValues: string[] = []) {
  return Object.values(PermissivenessInput.PermissivenessOptions)
    .filter(({ value }) => stringValues.includes(value))
    .map(({ title, value }) => ({ title, value }));
}

const title = "Who can update?";
const hash = "update-permissiveness";

export { UpdatePermissiveness as Component, title, hash };
