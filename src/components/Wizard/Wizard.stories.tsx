import React from "react";

import { Formik, FormikHelpers } from "formik";
import * as yup from "yup";

import { Wizard } from ".";
import {
  RadioInput,
  IntegerInput,
  PublicKeyInput,
  DurationInput,
  SelectInput,
  PermissivenessInput,
  JSONInput,
} from "./Inputs";
import { SubStepProps } from "./FormStep";
import { Form, FormikSubmitButton } from "./Form";
import { Button } from "baseui/button";
import { Block } from "baseui/block";
import { AnchorPermissivenessType } from "@raindrops-protocol/raindrops/build/state";
import { State } from "@raindrops-protocol/raindrops";
require("@solana/wallet-adapter-react-ui/styles.css");

export default {
  title: "Wizard",
  component: Wizard,
};

const TeaPreference = ({ data, handleSubmit }: SubStepProps) => {
  enum TFN {
    true = "true",
    false = "false",
    null = "null",
  }
  const schema = yup.object({
    likesTea: yup.string().required().oneOf(Object.values(TFN)),
    flavour: yup.array().of(yup.string().defined().required()).required(),
  });
  type TValues = yup.InferType<typeof schema>;
  return (
    <Formik
      initialValues={{
        likesTea: `${data?.likesTea}`,
        flavour: data?.flavour || [],
      }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        handleSubmit({
          likesTea:
            values.likesTea === "null" ? null : values.likesTea === "true",
          flavour: values.flavour,
        });
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <RadioInput.Inline
            name="likesTea"
            title="Do you drink tea?"
            help="Tea is a beverage that may be drunk either hot or cold"
            options={[
              { title: "Yes", value: TFN.true },
              { title: "No", value: TFN.false },
              { title: "Meh", value: TFN.null },
            ]}
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.likesTea}
            error={props.errors.likesTea}
          />
          {props.values.likesTea === TFN.true && (
            <SelectInput.Formik
              name="flavour"
              title="What flavours do you drink?"
              options={SelectInput.transformOptions([
                "Green tea",
                "Earl Grey",
                "Lapsang Souchong",
                "Horchata",
                ...props.values.flavour,
              ])}
              creatable
              multi
              value={props.values.flavour}
            />
          )}
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const NumberOfCups = ({ handleSubmit, data }: SubStepProps) => {
  const schema = yup.object({
    numCups: yup.number().integer().required().max(12, "That's too much tea!"),
    time: yup.object({
      [DurationInput.Units.minutes]: yup.number(),
      [DurationInput.Units.seconds]: yup.number(),
    }),
  });
  type TValues = yup.InferType<typeof schema>;
  const submit = (values: TValues) => {
    let cupsData = data?.cups || [];
    if (cupsData.length < values.numCups) {
      cupsData = [
        ...cupsData,
        ...Array(values.numCups - cupsData.length).fill({}),
      ];
    } else if (cupsData.length > values.numCups) {
      cupsData = cupsData.slice(0, values.numCups);
    }
    handleSubmit({
      numCups: values.numCups,
      cups: cupsData,
      time: DurationInput.toMilliseconds(values.time),
    });
  };
  return (
    <Formik
      initialValues={{
        numCups: data?.numCups,
        time:
          data?.time &&
          DurationInput.toDurationObject(data.time, [
            DurationInput.Units.minutes,
            DurationInput.Units.seconds,
          ]),
      }}
      onSubmit={(values: TValues, actions: FormikHelpers<TValues>) => {
        actions.setSubmitting(true);
        submit(values);
        actions.setSubmitting(false);
      }}
      validationSchema={schema}
    >
      {(props) => (
        <Form onSubmit={props.handleSubmit}>
          <IntegerInput.Inline
            name="numCups"
            title="How many cups do you drink a day?"
            max={12}
            endEnhancer="cups"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.numCups}
            error={props.errors.numCups}
          />
          <DurationInput.Inline
            name="time"
            title="How long do you take to drink a cup of tea?"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.time}
            error={props.errors.time}
            units={[DurationInput.Units.minutes, DurationInput.Units.seconds]}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

type CupDetailsProps = { cupNum: number };

const CupDetails = ({
  handleSubmit: submit,
  data,
  cupNum,
}: CupDetailsProps & SubStepProps) => {
  const handleSubmit = (temperature: string) => {
    const updatedCups = data.cups;
    updatedCups[cupNum] = { temperature };
    submit({ cups: updatedCups });
  };

  return (
    <>
      <RadioInput.Standalone
        title={`How do you take cup of tea no. ${cupNum + 1}?`}
        options={[
          { title: "Normal", value: "hot" },
          { title: "Iced", value: "cold" },
        ]}
        onSelect={handleSubmit}
        value={data?.cups[cupNum]?.temperature}
      />
      {data?.cups[cupNum]?.temperature && (
        <Button
          type="button"
          onClick={() => handleSubmit(data?.cups[cupNum]?.temperature)}
          style={{ alignSelf: "flex-end" }}
        >
          Next
        </Button>
      )}
    </>
  );
};

const WhoIsAllowed = ({ handleSubmit, data }: SubStepProps) => {
  const schema = yup.object({
    allowed: PermissivenessInput.validation.required().min(1),
  });
  type TValues = yup.InferType<typeof schema>;
  return (
    <Formik
      initialValues={{
        allowed: data?.allowed,
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
          <PermissivenessInput.Formik
            name="allowed"
            title="Who is allowed to send you tea?"
            value={props.values.allowed as (keyof AnchorPermissivenessType)[]}
            permissivenessType={
              State.ChildUpdatePropagationPermissivenessType.BuildPermissiveness
            }
            error={props.errors.allowed}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const SendReward = ({ handleSubmit, data }: SubStepProps) => {
  const schema = yup.object({
    wallet: PublicKeyInput.validation.required(),
  });
  type TValues = yup.InferType<typeof schema>;
  return (
    <Formik
      initialValues={{
        wallet: data?.wallet,
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
            name="wallet"
            title="What's your wallet address?"
            help="Enter your public key here for a free cup of tea"
            onChange={props.handleChange}
            onBlur={props.handleBlur}
            value={props.values.wallet}
            error={props.errors.wallet}
          />
          <FormikSubmitButton>Next</FormikSubmitButton>
        </Form>
      )}
    </Formik>
  );
};

const ReviewData = ({ handleSubmit, data }: SubStepProps) => {
  const submit = () => handleSubmit(data);
  return (
    <Block display="flex" flexDirection="column">
      <JSONInput.Display
        name="review"
        title="Review your answers"
        value={data}
        disabled
      />
      <Button $style={{ margin: "20px", alignSelf: "center" }} onClick={submit}>
        Complete
      </Button>
    </Block>
  );
};

export const SteppedForm = () => {
  const dataSchema = yup.object({
    likesTea: yup.mixed<boolean | null>().required(),
    numCups: yup.number().min(0),
    cups: yup.array(
      yup.object({ temperature: yup.string().oneOf(["hot", "cold"]) })
    ),
    time: yup.number(),
    wallet: PublicKeyInput.validation.required(),
  });
  type TData = yup.InferType<typeof dataSchema>;
  const [data, setData] = React.useState<TData>();
  const printData = () => console.log({ data });
  return (
    <Wizard onComplete={printData} values={data} setValues={setData}>
      <Wizard.Step
        title="Tea Preference"
        hash="likes-tea"
        Component={TeaPreference}
      />
      {data?.likesTea ? (
        <Wizard.Step
          title="How many?"
          hash="num-cups"
          Component={NumberOfCups}
        />
      ) : null}
      {data?.likesTea &&
        data?.cups?.map((_: any, index: number) => (
          <Wizard.Step<CupDetailsProps>
            title={`Cup of tea #${index + 1}`}
            hash={`cup-details-${index}`}
            key={`cup_${index}`}
            Component={CupDetails}
            cupNum={index}
          />
        ))}
      <Wizard.Step title="Who sends it?" hash="whom" Component={WhoIsAllowed} />
      <Wizard.Step
        title="Reward Address"
        hash="send-reward"
        Component={SendReward}
      />
      <Wizard.Step title="Review" hash="review-data" Component={ReviewData} />
    </Wizard>
  );
};
