import { Block } from "baseui/block";
import { FlexGrid, FlexGridItem } from "baseui/flex-grid";
import { ALIGNMENT, Cell, Grid } from "baseui/layout-grid";
import { ComponentMeta } from "@storybook/react";
import TokenDisplay, { LoadedToken } from ".";
import { useState } from "react";

export default {
  title: "TokenDisplay",
  component: TokenDisplay,
} as ComponentMeta<typeof TokenDisplay>;

export const Selected = () => (
  <div style={{ margin: "50px", width: "400px", height: "400px" }}>
    <LoadedToken
      imageSrc="https://www.arweave.net/30FpDd5TFKjG1Kav8US3UyZwpBwTW0eRDaimuPDImfg?ext=jpg"
      tokenName="CAT"
      handleToggleSelect={console.log}
      selected
    />
  </div>
);

export const NotSelected = () => (
  <div style={{ margin: "50px", width: "400px", height: "400px" }}>
    <LoadedToken tokenName="CAT" handleToggleSelect={console.log} />
  </div>
);

export const NoImage = () => (
  <div style={{ margin: "50px", width: "400px", height: "400px" }}>
    <LoadedToken tokenName="CAT" handleToggleSelect={console.log} />
  </div>
);

export const HasMultiple = () => (
  <div style={{ margin: "50px", width: "400px", height: "400px" }}>
    <LoadedToken
      imageSrc="https://www.arweave.net/30FpDd5TFKjG1Kav8US3UyZwpBwTW0eRDaimuPDImfg?ext=jpg"
      qty={44}
      tokenName="CAT"
      handleToggleSelect={console.log}
    />
  </div>
);

export const Gallery = () => {
  const [selectedUri, setSelected] = useState<string>();
  const tokens : [string, string, string, number][] = [
    [
      "Kitten #1",
      "https://arweave.net/rO9NpOhKmcTuPM0yCaymWolp673jkcjU0z76Kr0dzOg",
      "https://www.arweave.net/CyXNEFFdmt6Rj9Wys4-KVhvSHgcRrYKiK7actd6ClUg?ext=jpg",
      1
    ],
    [
      "Kitten #2",
      "https://arweave.net/Wr9zG0jjY_LiDsxTTIwAeHtHAfEUQh_a3pm2mv2wIjw",
      "https://www.arweave.net/MJI6GMKEytnHEEwTa8bAn_MOM7pRHnyGuKtEi9CB8a0?ext=jpg",
      3
    ],
    [
      "Kitten #3",
      "https://arweave.net/nFymf1LZYc5YPTtOYxPyODCsa3j65MNFBlyu_BzSLqY",
      "https://www.arweave.net/30FpDd5TFKjG1Kav8US3UyZwpBwTW0eRDaimuPDImfg?ext=jpg",
      1
    ],
    [
      "Kitten #4",
      "https://arweave.net/L-7pu6eUcNSlaALPum9o_lVQL9MyBT3Ndt4zKTzqK34",
      "https://www.arweave.net/q2O_7K-vYda4sf36Slo1VT0QtBzOk7FAPNWwgPOqXNY?ext=jpg",
      99
    ],
    [
      "Kitten #5",
      "https://arweave.net/L-7pu6eUcNSlaALPum9o_lVQL9MyBT3Ndt4zKTzqK94",
      "",
      1
    ],
  ];
  return (
    <Block margin="20px" onClick={() => setSelected(undefined)}>
      <FlexGrid
        flexGridColumnCount={[1, 3, 4, 6]}
        flexGridColumnGap="scale800"
        flexGridRowGap="scale800"
      >
        {tokens.map(([name, uri, imageSrc, qty]) => (
          <FlexGridItem key={`cell_${uri}`}>
            <LoadedToken
              tokenName={name}
              selected={uri === selectedUri}
              imageSrc={imageSrc}
              qty={qty}
              handleToggleSelect={() =>
                setSelected(selectedUri === uri ? undefined : uri)
              }
            />
          </FlexGridItem>
        ))}
      </FlexGrid>
    </Block>
  );
};
