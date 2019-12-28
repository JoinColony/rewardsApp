import { open } from "@colony/purser-metamask";
import { bigNumber } from "@colony/purser-core/utils";
import { getNetworkClient } from "@colony/colony-js-client";

export async function openWallet(context) {
  const wallet = await open();
  context.commit("setWallet", { wallet });
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

  const rewardPercentage =
    1 / ((await colonyClient.getRewardInverse.call()).rewardInverse / 100);

  context.commit("setColonyClient", { colonyClient });
  context.commit("setRewardPercentage", { rewardPercentage });
  context.dispatch("setUserRoles");
  context.dispatch("setRewardPotTokens");
  context.dispatch("setNonRewardPotTokens");
  context.dispatch("setDomains");
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

export async function setRewardPotTokens(context) {
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

export async function setNonRewardPotTokens(context) {
  const colonyClient = context.getters["getColonyClient"];

  const fundsClaimed = await colonyClient.getEvents({
    eventNames: ["ColonyFundsClaimed"],
    fromBlock: 1
  });

  const uniqueTokens = [...new Set(fundsClaimed.map(item => item.token))];

  uniqueTokens.forEach(async token => {
    const balance = (
      await colonyClient.getNonRewardPotsTotal.call({
        token
      })
    ).total.toString();

    if (balance > 0) {
      context.commit("addNonRewardPotToken", { token, balance });
    }
  });
}

export async function setDomains(context) {
  const colonyClient = context.getters["getColonyClient"];

  const { count } = await colonyClient.getDomainCount.call();

  for (let index = 1; index <= count; index++) {
    const domain = await colonyClient.getDomain.call({
      domainId: index
    });
    context.commit("addDomain", { domain });
  }
}

export async function moveFunds(context, payload) {
  const colonyClient = context.getters["getColonyClient"];

  await colonyClient.moveFundsBetweenPots.send({
    fromPot: payload.fromPot,
    toPot: payload.toPot,
    amount: bigNumber(payload.amount).toWei(),
    token: payload.token
  });
}

export async function setRewardInverse(context, payload) {
  const colonyClient = context.getters["getColonyClient"];

  await colonyClient.setRewardInverse.send({
    rewardInverse: bigNumber(1 / (payload.rewardPercentage / 100))
  });

  context.commit("setRewardPercentage", payload);
}
