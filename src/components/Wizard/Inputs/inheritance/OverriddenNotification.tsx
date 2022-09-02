import { Alert } from "baseui/icon";
import { KIND, Notification } from "baseui/notification";

const OverriddenNotification = () => (
  <Notification
    kind={KIND.info}
    overrides={{
      Body: { style: { flexBasis: "100%" } },
      InnerContainer: {
        style: { display: "flex", alignItems: "center" },
      },
    }}
  >
    <Alert
      overrides={{ Svg: { style: { marginRight: "5px" } } }}
      size="scale800"
    />{" "}
    Parent has disallowed editing of this permissiveness, the above is for
    information only.
  </Notification>
);

export default OverriddenNotification;
