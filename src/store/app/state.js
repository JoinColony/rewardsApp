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
  rewardDistributionDialog: false,
  lockTokensDialog: false,
  selectedToken: { token: "0x0", balance: "0" },
  rewardPotTokens: [],
  nonRewardPotTokens: [],
  domains: [],
  rewardPercentage: 0,
  rewardPayoutsInfo: []
};
