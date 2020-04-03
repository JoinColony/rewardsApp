export function payoutToken(state) {
  return payoutToken => {
    return state.rewardPotTokens.find(token => token.token === payoutToken);
  };
}
