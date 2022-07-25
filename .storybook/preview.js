// .storybook/preview.js

import React from "react";

import { BaseProvider, DarkTheme } from "baseui";
import { Block } from "baseui/block";
import { Client as Styletron } from "styletron-engine-atomic";
import { Provider as StyletronProvider } from "styletron-react";

const engine = new Styletron();

export const decorators = [
  (Story) => (
    <StyletronProvider value={engine}>
      <BaseProvider theme={DarkTheme}>
        <Block
          width="100vw"
          height="100vh"
          display="flex"
          alignItems="center"
          justifyContent="center"
          backgroundColor="backgroundPrimary"
        >
          <Story />
        </Block>
      </BaseProvider>
    </StyletronProvider>
  ),
];
