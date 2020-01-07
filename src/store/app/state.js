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
  selectedToken: "0x0",
  rewardPotTokens: [],
  nonRewardPotTokens: [],
  domains: [],
  rewardPercentage: 0,
  rewardPayoutsInfo: []
};
