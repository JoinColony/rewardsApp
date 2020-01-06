export function setWallet(state, { wallet }) {
  state.user.wallet = wallet;
}

export function setNetworkClient(state, { networkClient }) {
  state.networkClient = networkClient;
}

export function setColonyClient(state, { colonyClient }) {
  state.colonyClient = colonyClient;
}

export function setUserRoles(state, { hasRootRole, hasFundingRole }) {
  state.user.hasRootRole = hasRootRole;
  state.user.hasFundingRole = hasFundingRole;
}

export function clearUserRoles(state) {
  state.user.hasRootRole = false;
  state.user.hasFundingRole = false;
}

export function clearRewardPercentage(state) {
  state.rewardPercentage = 0;
}

export function toggleMoveFundsDialog(state, isOpen) {
  if (typeof isOpen === "boolean") {
    state.moveFundsDialog = isOpen;
  } else {
    state.moveFundsDialog = !state.moveFundsDialog;
  }
}

export function toggleSetRewardsDialog(state, isOpen) {
  if (typeof isOpen === "boolean") {
    state.setRewardsDialog = isOpen;
  } else {
    state.setRewardsDialog = !state.setRewardsDialog;
  }
}

export function toggleRewardDistributionDialog(state, isOpen) {
  if (typeof isOpen === "boolean") {
    state.rewardDistributionDialog = isOpen;
  } else {
    state.rewardDistributionDialog = !state.rewardDistributionDialog;
  }
}

export function addRewardPotToken(state, { token, balance }) {
  state.rewardPotTokens.push({
    token,
    balance
  });
}

export function clearRewardPotTokens(state) {
  state.rewardPotTokens = [];
}

export function addNonRewardPotToken(state, { token, balance }) {
  state.nonRewardPotTokens.push({
    token,
    balance
  });
}

export function clearNonRewardPotTokens(state) {
  state.nonRewardPotTokens = [];
}

export function addDomain(state, { domain }) {
  state.domains.push(domain);
}

export function clearDomains(state) {
  state.domains = [];
}

export function setRewardPercentage(state, { rewardPercentage }) {
  state.rewardPercentage = rewardPercentage;
}

export function setColonyAddress(state, { address }) {
  state.colonyAddress = address;
}

export function addRewardPayoutInfo(state, { payoutInfo }) {
  state.rewardPayoutsInfo.push({
    ...payoutInfo
  });
}
