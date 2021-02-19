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

export async function setNetworkClient({ commit, state }) {
  const wallet = state.user.wallet;
  const networkClient = await getNetworkClient(
    "mainnet",
    wallet,
    "b70eb0a2bdb942e8acd7c6d3ed22f69e"
  );

  commit("setNetworkClient", { networkClient });
}

export async function setColonyClient(
  { commit, dispatch, state },
  { address }
) {
  const networkClient = state.networkClient;
  const colonyClient = await networkClient.getColonyClientByAddress(address);

  resetColony(commit);
  commit("setColonyClient", { colonyClient });
  commit("setColonyAddress", { address });
  initializeColony(dispatch);
}

function resetColony(commit) {
  commit("clearDomains");
  commit("clearRewardPayouts");
  commit("clearRewardPotTokens");
  commit("clearNonRewardPotTokens");
  commit("clearUserRoles");
  commit("clearRewardPercentage");
}

function initializeColony(dispatch) {
  dispatch("setCurrentLock");
  dispatch("setRewardPercentage");
  dispatch("setUserRoles");
  dispatch("setTokens");
  dispatch("setRewardPayouts");
  dispatch("setDomains");
}

export async function setRewardPercentage({ commit, state }) {
  const colonyClient = state.colonyClient;

  const rewardPercentage = Math.round(
    1 / ((await colonyClient.getRewardInverse.call()).rewardInverse / 100)
  );

  commit("setRewardPercentage", { rewardPercentage });
}

export async function setUserRoles({ commit, state }) {
  const colonyClient = state.colonyClient;
  const wallet = state.user.wallet;

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

export async function setTokens({ commit, state }) {
  const colonyClient = state.colonyClient;

  const fundsClaimed = await colonyClient.getEvents({
    address: state.colonyAddress,
    eventNames: ["ColonyFundsClaimed"],
    fromBlock: 1
  });

  const uniqueTokens = [...new Set(fundsClaimed.map(item => item.token))];

  uniqueTokens.forEach(async token => {
    const rewardsPotBalance = (
      await colonyClient.getFundingPotBalance.call({
        potId: 0, // Rewards Pot
        token
      })
    ).balance;

    const nonRewardsPotBalance = (
      await colonyClient.getNonRewardPotsTotal.call({
        token
      })
    ).total;

    const tokenInstance = await new web3.eth.Contract(erc20ABI, token);
    let name = "Ether";
    let symbol = "ETH";

    if (
      tokenInstance._address !== "0x0000000000000000000000000000000000000000"
    ) {
      name = await tokenInstance.methods.name().call();
      symbol = await tokenInstance.methods.symbol().call();
    }

    if (rewardsPotBalance > 0) {
      commit("addRewardPotToken", {
        token,
        balance: rewardsPotBalance,
        name,
        symbol
      });
    }
    if (nonRewardsPotBalance > 0) {
      commit("addNonRewardPotToken", {
        token,
        balance: nonRewardsPotBalance,
        symbol
      });
    }
  });
}

export async function setRewardPayouts({ commit, state }) {
  const colonyClient = state.colonyClient;

  const payoutsStarted = await colonyClient.getEvents({
    address: state.colonyAddress,
    eventNames: ["RewardPayoutCycleStarted"],
    fromBlock: 1
  });

  const payoutsEnded = await colonyClient.getEvents({
    address: state.colonyAddress,
    eventNames: ["RewardPayoutCycleEnded"],
    fromBlock: 1
  });

  payoutsStarted.forEach(async ({ payoutId }) => {
    const payoutInfo = await colonyClient.getRewardPayoutInfo.call({
      payoutId
    });

    const active = !payoutsEnded.includes(payoutId);

    // const fundsClaimed = await colonyClient.getEvents({
    //   eventNames: ["RewardPayoutClaimed"],
    //   fromBlock: 1
    // });

    commit("addRewardPayoutInfo", {
      active,
      payoutId,
      payoutInfo
      // fundsClaimed
    });
  });
}

export async function setNonRewardPotTokens({ commit, state }) {
  const colonyClient = state.colonyClient;

  const fundsClaimed = await colonyClient.getEvents({
    address: state.colonyAddress,
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
        tokenInstance.address !== "0x0000000000000000000000000000000000000000"
      ) {
        symbol = await tokenInstance.methods.symbol().call();
      }
      commit("addNonRewardPotToken", { token, balance, symbol });
    }
  });
}

export async function setDomains({ commit, state }) {
  const colonyClient = state.colonyClient;

  const { count } = await colonyClient.getDomainCount.call();

  for (let index = 1; index <= count; index++) {
    const domain = await colonyClient.getDomain.call({
      domainId: index
    });
    commit("addDomain", { domain });
  }
}

export async function moveFunds({ state }, { fromPot, toPot, amount, token }) {
  const colonyClient = state.colonyClient;

  await colonyClient.moveFundsBetweenPots.send({
    fromPot,
    toPot,
    amount: bigNumber(web3.utils.toWei(amount)),
    token: token.value
  });
}

export async function setRewardInverse(
  { commit, state },
  { rewardPercentage }
) {
  const colonyClient = state.colonyClient;

  await colonyClient.setRewardInverse.send({
    rewardInverse: bigNumber(1 / (rewardPercentage / 100))
  });

  commit("setRewardPercentage", { rewardPercentage });
}

export async function startNextRewardPayout(
  { commit, dispatch, state },
  { token }
) {
  const { colonyAddress, colonyClient, networkClient } = state;

  const { rootHash } = await networkClient.getReputationRootHash.call();
  const { skillId } = await colonyClient.getDomain.call({ domainId: 1 });
  const userAddress = "0x0000000000000000000000000000000000000000";

  const { key, value, branchMask, siblings } = (
    await axios.get(
      `https://colony.io/reputation/mainnet/${rootHash}/${colonyAddress}/${skillId}/${userAddress}`
    )
  ).data;

  await colonyClient.startNextRewardPayout.send({
    token,
    key,
    value,
    branchMask,
    siblings
  });

  dispatch("setCurrentLock");
  commit("clearRewardPayouts");
  dispatch("setRewardPayouts");
}

export async function setCurrentLock({ commit, state }) {
  const { colonyClient } = state;
  const { tokenLockingClient } = colonyClient;
  const [user] = await web3.eth.getAccounts();
  const { address: token } = await colonyClient.getTokenAddress.call();

  const {
    count: totalLockId
  } = await tokenLockingClient.getTotalLockCount.call({
    token
  });

  const { count: userLockId } = await tokenLockingClient.getUserLock.call({
    token,
    user
  });

  commit("setCurrentLock", { totalLockId, userLockId });
}
