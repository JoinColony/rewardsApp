export function rewardPayoutInfo(state) {
  return token => {
    return state.rewardPayouts.find(
      payoutInfo => payoutInfo.tokenAddress === token
    );
  };
}

export function payoutToken(state) {
  return payoutToken => {
    return state.rewardPotTokens.find(token => token.token === payoutToken);
  };
}
