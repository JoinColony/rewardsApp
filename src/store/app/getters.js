export function payoutToken(state) {
  return payoutToken => {
    return state.rewardPotTokens.find(token => token.token === payoutToken);
  };
}

export function sortedRewardsPayouts(state) {
  return [...state.rewardPayouts].sort((a, b) =>
    a.payoutId > b.payoutId ? 1 : -1
  );
}
