import React, { useEffect } from "react";

import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import { useConnection } from "@solana/wallet-adapter-react";
import { NotificationCircle, PLACEMENT } from "baseui/badge";
import { Card, StyledBody, StyledAction } from "baseui/card";
import { LabelLarge, LabelSmall } from "baseui/typography";
import { Check } from "baseui/icon";
import { Button, KIND } from "baseui/button";
import { useStyletron } from "baseui";

import { TokenInfo } from "../../hooks/useFetchWalletTokens";
import { fetchMetadata } from "./utils";
import NoImage from "../../assets/No-Image.png";

const TokenDisplay = ({
  mintAddr,
  qty,
  selected,
  handleToggleSelect,
}: TokenInfo & Omit<LoadedTokenProps, "imageSrc" | "tokenName">) => {
  const { connection } = useConnection();
  const [metadata, setMetadata] = React.useState<Metadata>();
  const [loadingMetadata, setLoadingMetadata] = React.useState(true);
  useEffect(() => {
    setLoadingMetadata(true);
    setMetadata(undefined);
    fetchMetadata(connection, mintAddr, (newMetadata: Metadata) => {
      setMetadata(newMetadata);
      setLoadingMetadata(false);
    });
  }, [connection, mintAddr]);
  const [imageSrc, setImageSrc] = React.useState<string>();
  const [, setLoadingImage] = React.useState(true);
  useEffect(() => {
    if (!loadingMetadata && metadata && metadata.data.uri) {
      setLoadingImage(true);
      setImageSrc(undefined);
      fetchImage(metadata.data.uri, (data: { src: string }) => {
        setImageSrc(data.src);
        setLoadingImage(false);
      });
    }
  }, [metadata]);
  return (
    <>
      {metadata ? (
        <LoadedToken
          imageSrc={imageSrc}
          tokenName={metadata.data.name}
          handleToggleSelect={handleToggleSelect}
          qty={qty}
          selected={selected}
        />
      ) : null}
    </>
  );
};

export const LoadedToken = ({
  imageSrc,
  tokenName,
  handleToggleSelect,
  qty = 1,
  selected = false,
}: LoadedTokenProps) => {
  return (
    <NotificationCircle
      content={<Check />}
      placement={PLACEMENT.topLeft}
      hidden={!selected}
      color="primary"
      overrides={{
        Root: { style: { width: "calc(100% - 12px)", height: "100%" } },
      }}
    >
      <Card
        headerImage={imageSrc || NoImage}
        // @ts-ignore
        onClick={
          handleToggleSelect
            ? (e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleSelect();
              }
            : undefined
        }
        overrides={{
          HeaderImage: {
            component: HeaderImage,
          },
          Root: {
            style: ({ $theme }) => ({
              display: "flex",
              flexDirection: "column",
              height: "100%",
              alignItems: "stretch",
              justifyContent: "space-between",
              borderColor: selected
                ? $theme.colors.primary
                : $theme.colors.borderOpaque,
              boxShadow:
                qty > 1
                  ? [
                      `5px 5px 0px 0px ${$theme.colors.contentInverseSecondary}`,
                      `8px 8px 0px 0px ${$theme.colors.contentInverseTertiary}`,
                      `12px 12px 0px 0px ${$theme.colors.contentInverseSecondary}`,
                    ].join(", ")
                  : undefined,
            }),
          },
        }}
      >
        <StyledBody>
          <LabelLarge
            display="inline"
            overrides={{
              Block: {
                style: { overflowWrap: "anywhere", marginTop: "10px" },
              },
            }}
          >
            {tokenName.replace(/[^a-z0-9#_]/gi, "")}
          </LabelLarge>
          {qty > 1 ? <LabelSmall display="inline"> x {qty}</LabelSmall> : null}
        </StyledBody>
        {handleToggleSelect && (
          <StyledAction>
            <Button
              overrides={{ BaseButton: { style: { width: "100%" } } }}
              kind={selected ? KIND.primary : KIND.secondary}
              // @ts-ignore
              onClick={(e: MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                handleToggleSelect();
              }}
            >
              {selected ? "Selected" : "Select"}
            </Button>
          </StyledAction>
        )}
      </Card>
    </NotificationCircle>
  );
};

const HeaderImage = ({ src }: { src: string }) => {
  const [, theme] = useStyletron();
  return (
    <div
      style={{
        backgroundColor: theme.colors.contentInverseSecondary,
        backgroundImage: `url('${src}')`,
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        height: "10em",
        width: "100%",
      }}
    />
  );
};

type LoadedTokenProps = {
  tokenName: Metadata["data"]["name"];
  imageSrc?: string;
  handleToggleSelect?: () => void;
  qty?: number;
  selected?: boolean;
};

const fetchImage = async (uri: string, callback: Function) => {
  const data = await fetch(uri);
  const parsed = await data.json();
  callback({ src: parsed?.image });
};

export default TokenDisplay;
