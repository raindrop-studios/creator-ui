import { State } from "@raindrops-protocol/raindrops";
import { PermissivenessOption } from "./types";

export const PermissivenessOptions: {
  [permissivenessType: string]: PermissivenessOption;
} = {
  [State.PermissivenessType.TokenHolder]: {
    title: "Token Holder",
    description: "In order to do the action, the item class NFT must be held.",
    value: "tokenHolder",
  },
  [State.PermissivenessType.ParentTokenHolder]: {
    title: "Parent Token Holder",
    description:
      "In order to do the action, the parent class of this class NFT must be held.",
    value: "parentTokenHolder",
  },
  [State.PermissivenessType.UpdateAuthority]: {
    title: "Update Authority",
    description:
      "In order to do the action, the signer must be the update authority on the metadata of the item class or item.",
    value: "updateAuthority",
  },
  [State.PermissivenessType.Anybody]: {
    title: "Anybody",
    description:
      "Anybody can do this action. There are no requirements to be met.",
    value: "anybody",
  },
};

export const ChangedFromInherited = "INHERITED_AND_CHANGED";

