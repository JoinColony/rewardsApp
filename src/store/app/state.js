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
  selectedPayout: {},
  rewardPotTokens: [],
  nonRewardPotTokens: [],
  domains: [],
  rewardPercentage: 0,
  rewardPayouts: [],
  totalLockId: 0,
  userLockId: 0
};
