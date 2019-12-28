export function getUser(state) {
  return state.user;
}

export function getWallet(state) {
  return state.user.wallet;
}

export function getNetworkClient(state) {
  return state.networkClient;
}

export function getColonyClient(state) {
  return state.colonyClient;
}

export function getRewardPotTokens(state) {
  return state.rewardPotTokens;
}

export function getNonRewardPotTokens(state) {
  return state.nonRewardPotTokens;
}

export function getDomains(state) {
  return state.domains;
}

export function getRewardPercentage(state) {
  return state.rewardPercentage;
}
