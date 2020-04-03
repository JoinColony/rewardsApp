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
  selectedPayout: null,
  rewardPotTokens: [],
  nonRewardPotTokens: [],
  domains: [],
  rewardPercentage: 0,
  rewardPayouts: []
};
