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

export function getRewardPayouts(state) {
  return state.rewardPayouts;
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
  return Math.round(state.rewardPercentage);
}

export function getColonyAddress(state) {
  return state.colonyAddress;
}

export function rewardPayoutInfo(state) {
  return token => {
    return state.rewardPayouts.find(
      payoutInfo => payoutInfo.tokenAddress === token
    );
  };
}

export function rewardPayouts(state) {
  return state.rewardPayouts;
}

export function payoutToken(state) {
  return payoutToken => {
    return state.rewardPotTokens.find(token => token.token === payoutToken);
  };
}
