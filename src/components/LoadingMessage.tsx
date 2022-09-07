import { Block } from "baseui/block";
import { Spinner, SIZE } from "baseui/spinner";
import { LabelLarge } from "baseui/typography";

const LoadingMessage = ({ message }: { message: string }) => (
  <Block
    display="flex"
    flexDirection="column"
    alignItems="center"
    alignSelf="center"
    width="100%"
    $style={{ textAlign: "center" }}
  >
    <Spinner $size={SIZE.large} $style={{margin: "40px"}} />
    <LabelLarge>{message}</LabelLarge>
  </Block>
);

export { LoadingMessage };
