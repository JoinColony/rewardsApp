import { open } from "@colony/purser-metamask";
import { bigNumber } from "@colony/purser-core/utils";
import { getNetworkClient } from "@tommycox/colony-js-client";
import axios from "axios";
import { web3 } from "../../boot/web3";
import erc20ABI from "human-standard-token-abi";

export async function openWallet({ commit }) {
  const wallet = await open();
  commit("setWallet", { wallet });
}

export async function setNetworkClient({ commit, getters }) {
  const wallet = getters["getWallet"];
  const networkClient = await getNetworkClient("goerli", wallet);
  commit("setNetworkClient", { networkClient });
}

export async function setColonyClient(
  { commit, dispatch, getters },
  { address }
) {
  const networkClient = getters["getNetworkClient"];
  const colonyClient = await networkClient.getColonyClientByAddress(address);

  resetColony(commit);
  commit("setColonyClient", { colonyClient });
  commit("setColonyAddress", { address });
  initializeColony(dispatch);
}

function resetColony(commit) {
  commit("clearRewardPercentage");
  commit("clearUserRoles");
  commit("clearRewardPotTokens");
  commit("clearNonRewardPotTokens");
  commit("clearDomains");
}

function initializeColony(dispatch) {
  dispatch("setRewardPercentage");
  dispatch("setUserRoles");
  dispatch("setRewardPotTokens");
  dispatch("setNonRewardPotTokens");
  dispatch("setDomains");
}

export async function setRewardPercentage({ commit, getters }) {
  const colonyClient = getters["getColonyClient"];

  const rewardPercentage =
    1 / ((await colonyClient.getRewardInverse.call()).rewardInverse / 100);

  commit("setRewardPercentage", { rewardPercentage });
}

export async function setUserRoles({ commit, getters }) {
  const colonyClient = getters["getColonyClient"];
  const wallet = getters["getWallet"];

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

  commit("setUserRoles", { hasRootRole, hasFundingRole });
}

export async function setRewardPotTokens({ commit, dispatch, getters }) {
  const colonyClient = getters["getColonyClient"];

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

    const payout = (
      await colonyClient.getFundingPotPayout.call({
        potId: 0, // Rewards Pot
        token
      })
    ).payout.toString();

    if (balance > 0) {
      const tokenInstance = await new web3.eth.Contract(erc20ABI, token);
      let name = "Ether";
      let symbol = "ETH";

      if (
        tokenInstance._address !== "0x0000000000000000000000000000000000000000"
      ) {
        name = await tokenInstance.methods.name().call();
        symbol = await tokenInstance.methods.symbol().call();
      }
      commit("addRewardPotToken", { token, balance, payout, name, symbol });
    }
  });

  dispatch("updateRewardPayoutInfo");
}

export async function updateRewardPayoutInfo({ commit, getters }) {
  const colonyClient = getters["getColonyClient"];

  const payoutsStarted = await colonyClient.getEvents({
    eventNames: ["RewardPayoutCycleStarted"],
    fromBlock: 1
  });

  payoutsStarted.forEach(async ({ payoutId }) => {
    const payoutInfo = await colonyClient.getRewardPayoutInfo.call({
      payoutId
    });

    commit("addRewardPayoutInfo", { payoutInfo });
  });
}

export async function setNonRewardPotTokens({ commit, getters }) {
  const colonyClient = getters["getColonyClient"];

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
      const tokenInstance = await new web3.eth.Contract(erc20ABI, token);
      let symbol = "ETH";

      if (
        tokenInstance._address !== "0x0000000000000000000000000000000000000000"
      ) {
        symbol = await tokenInstance.methods.symbol().call();
      }
      commit("addNonRewardPotToken", { token, balance, symbol });
    }
  });
}

export async function setDomains({ commit, getters }) {
  const colonyClient = getters["getColonyClient"];

  const { count } = await colonyClient.getDomainCount.call();

  for (let index = 1; index <= count; index++) {
    const domain = await colonyClient.getDomain.call({
      domainId: index
    });
    commit("addDomain", { domain });
  }
}

export async function moveFunds(
  { getters },
  { fromPot, toPot, amount, token }
) {
  const colonyClient = getters["getColonyClient"];

  await colonyClient.moveFundsBetweenPots.send({
    fromPot,
    toPot,
    amount: bigNumber(web3.utils.toWei(amount)),
    token: token.value
  });
}

export async function setRewardInverse(
  { commit, getters },
  { rewardPercentage }
) {
  const colonyClient = getters["getColonyClient"];

  await colonyClient.setRewardInverse.send({
    rewardInverse: bigNumber(1 / (rewardPercentage / 100))
  });

  commit("setRewardPercentage", { rewardPercentage });
}

export async function startNextRewardPayout({ getters }, { token }) {
  const networkClient = getters["getNetworkClient"];
  const colonyClient = getters["getColonyClient"];
  const colonyAddress = getters["getColonyAddress"];

  const { rootHash } = await networkClient.getReputationRootHash.call();
  const { skillId } = await colonyClient.getDomain.call({ domainId: 1 });
  const userAddress = "0x0000000000000000000000000000000000000000";

  const { key, value, branchMask, siblings } = (
    await axios.get(
      `https://colony.io/reputation/goerli/${rootHash}/${colonyAddress}/${skillId}/${userAddress}`
    )
  ).data;

  await colonyClient.startNextRewardPayout.send({
    token,
    key,
    value,
    branchMask,
    siblings
  });
}
