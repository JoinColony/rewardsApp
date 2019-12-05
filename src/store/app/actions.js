import { open } from "@colony/purser-metamask";
import { getNetworkClient } from "@colony/colony-js-client";

export async function openWallet(context) {
  const wallet = await open();
  context.commit("openWallet", { wallet });
}

export async function setNetworkClient(context) {
  const wallet = context.getters["getWallet"];
  const networkClient = await getNetworkClient("goerli", wallet);
  context.commit("setNetworkClient", { networkClient });
}

export async function setColonyClient(context, payload) {
  const networkClient = context.getters["getNetworkClient"];

  const colonyClient = await networkClient.getColonyClientByAddress(
    payload.address
  );

  context.commit("setColonyClient", { colonyClient });
  context.dispatch("setUserRoles");
}

export async function setUserRoles(context) {
  const colonyClient = context.getters["getColonyClient"];
  const wallet = context.getters["getWallet"];

  const isRoot = (
    await colonyClient.hasColonyRole.call({
      address: wallet.address,
      domainId: 1,
      role: "ROOT"
    })
  ).hasRole;

  const isFunding = (
    await colonyClient.hasColonyRole.call({
      address: wallet.address,
      domainId: 1,
      role: "FUNDING"
    })
  ).hasRole;

  context.commit("setUserRoles", { isRoot, isFunding });
}
