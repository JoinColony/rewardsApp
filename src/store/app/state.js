export default {
  networkClient: null,
  colonyClient: null,
  colonyAddress: "0x0",
  user: {
    wallet: null,
    hasRootRole: false,
    hasFundingRole: false
  },
  moveFundsDialog: false,
  setRewardsDialog: false,
  payoutDialog: false,
  lockTokensDialog: false,
  startPayoutDialog: false,
  selectedToken: { token: "0x0", balance: "0" },
  selectedPayout: {},
  rewardPotTokens: [],
  nonRewardPotTokens: [],
  domains: [],
  rewardPercentage: 0,
  rewardPayouts: []
};
