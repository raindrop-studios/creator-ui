import { useState } from "react";
import { Wizard } from "../components/Wizard";
import * as ConnectWallet from "./ConnectWallet";
import * as NameItem from "./NameItem";
import * as TokenSelect from "./TokenSelect";
import * as ItemClassIndex from "./ItemClassIndex";
import * as HasParent from "./HasParent";
import * as ParentItemClass from "./ParentItemClass";

const CreateItemClassWizard = () => {
  const [data, setData] = useState<any>({});
  const printData = () => console.log({ data });
  return (
    <Wizard onComplete={printData} values={data} setValues={setData}>
      <Wizard.Step
        title={ConnectWallet.title}
        hash={ConnectWallet.hash}
        Component={ConnectWallet.Component}
      />
      <Wizard.Step
        title={NameItem.title}
        hash={NameItem.hash}
        Component={NameItem.Component}
      />
      <Wizard.Step
        title={TokenSelect.title}
        hash={TokenSelect.hash}
        Component={TokenSelect.Component}
        name="mint"
      />
      <Wizard.Step
        title={ItemClassIndex.title}
        hash={ItemClassIndex.hash}
        Component={ItemClassIndex.Component}
      />
      <Wizard.Step
        title={HasParent.title}
        hash={HasParent.hash}
        Component={HasParent.Component}
      />
      {data?.hasParent && <Wizard.Step
        title={ParentItemClass.title}
        hash={ParentItemClass.hash}
        Component={ParentItemClass.Component}
      />}
    </Wizard>
  );
};

export { CreateItemClassWizard };
