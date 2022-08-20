import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { useFormikContext } from "formik";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { Block } from "baseui/block";

import useFetchWalletTokens from "../../../hooks/useFetchWalletTokens";
import TokenDisplay from "../../TokenDisplay";
import { FormControlBlock } from "./FormControlBlock";
import { InputProps } from "./common";
import { useMemo } from "react";
import { LoadingMessage } from "../../LoadingMessage";

export function Inline({
  title,
  help,
  value,
  error,
  setValue,
  setMetadataValue,
}: TokenInputProps) {
  const { loading, tokens } = useFetchWalletTokens();
  const tokenDisplays = useMemo(
    () =>
      tokens.map(({ mintAddr, qty }) => (
        <FlexGridItem key={`token_${mintAddr}`}>
          <TokenDisplay
            mintAddr={mintAddr}
            selected={mintAddr === value}
            qty={qty}
            handleToggleSelect={() => {
              setValue(value === mintAddr ? undefined : mintAddr);
            }}
            setMetadata={setMetadataValue}
          />
        </FlexGridItem>
      )),
    [tokens, value]
  );
  return (
    <FormControlBlock title={title} help={help} error={error}>
      <Block margin="20px" onClick={() => setValue(undefined)}>
        <FlexGrid
          flexGridColumnCount={[1, 3, 5]}
          flexGridColumnGap="scale800"
          flexGridRowGap="scale800"
        >
          {loading ? (
            <LoadingMessage message="Fetching your NFTs" />
          ) : (
            tokenDisplays
          )}
        </FlexGrid>
      </Block>
    </FormControlBlock>
  );
}

export function Formik(
  props: Omit<TokenInputProps, "setValue" | "setMetadataValue">
) {
  const { setFieldValue } = useFormikContext();
  const setValue = (value: string | undefined) =>
    setFieldValue(props.name, value);
  const setMetadataValue = (value: Metadata | undefined) =>
    setFieldValue(`${props.name}_metadata`, value);
  return (
    <Inline
      {...props}
      setValue={setValue}
      setMetadataValue={setMetadataValue}
    />
  );
}

export interface TokenInputProps
  extends Omit<InputProps, "onChange" | "onBlur"> {
  value: string | undefined;
  setValue: (arg: string | undefined) => void;
  setMetadataValue: (arg: Metadata | undefined) => void;
}
