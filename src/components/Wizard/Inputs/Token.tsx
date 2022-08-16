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
}: TokenInputProps) {
  const { loading, tokens } = useFetchWalletTokens();
  const tokenDisplays = useMemo(() =>
    tokens.map(({ mintAddr, qty }) => (
      <FlexGridItem key={`token_${mintAddr}`}>
        <TokenDisplay
          mintAddr={mintAddr}
          selected={mintAddr === value}
          qty={qty}
          handleToggleSelect={() =>
            setValue(value === mintAddr ? undefined : mintAddr)
          }
        />
      </FlexGridItem>
    )), [tokens, value]
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

export function Formik(props: Omit<TokenInputProps, "setValue">) {
  const { setFieldValue } = useFormikContext();
  const setValue = (value: string | undefined) =>
    setFieldValue(props.name, value);
  return <Inline {...props} setValue={setValue} />;
}

export interface TokenInputProps
  extends Omit<InputProps, "onChange" | "onBlur"> {
  value: string | undefined;
  setValue: (arg: string | undefined) => void;
}
