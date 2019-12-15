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
  context.dispatch("setRewardsPotTokens");
}

export async function setUserRoles(context) {
  const colonyClient = context.getters["getColonyClient"];
  const wallet = context.getters["getWallet"];

  const hasRootRole = (
    await colonyClient.hasColonyRole.call({
      address: wallet.address,
      domainId: 1,
      role: "ROOT"
    })
  ).hasRole;

  const hasFundingRole = (
    await colonyClient.hasColonyRole.call({
      address: wallet.address,
      domainId: 1,
      role: "FUNDING"
    })
  ).hasRole;

  context.commit("setUserRoles", { hasRootRole, hasFundingRole });
}

export async function setRewardsPotTokens(context) {
  const colonyClient = context.getters["getColonyClient"];

  const fundsClaimed = await colonyClient.getEvents({
    eventNames: ["ColonyFundsClaimed"],
    fromBlock: 1
  });

  const uniqueTokens = [...new Set(fundsClaimed.map(item => item.token))];

  uniqueTokens.forEach(async token => {
    const balance = (
      await colonyClient.getFundingPotBalance.call({
        potId: 0, // Rewards Pot
        token
      })
    ).balance.toString();

    if (balance > 0) {
      context.commit("addRewardPotToken", { token, balance });
    }
  });
}
