<template>
  <div id="q-app">
    <router-view />

    <MoveFundsDialog />
    <SetRewardsDialog />
    <RewardDistributionDialog />
  </div>
</template>

<script>
import MoveFundsDialog from "components/dialogs/MoveFundsDialog";
import SetRewardsDialog from "components/dialogs/SetRewardsDialog";
import RewardDistributionDialog from "components/dialogs/RewardDistributionDialog";

export default {
  name: "App",
  components: {
    MoveFundsDialog,
    SetRewardsDialog,
    RewardDistributionDialog
  }
};
</script>
