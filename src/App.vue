<template>
  <div id="q-app">
    <router-view />

    <MoveFundsDialog />
    <SetRewardsDialog />
  </div>
</template>

<script>
import MoveFundsDialog from "components/dialogs/MoveFundsDialog";
import SetRewardsDialog from "components/dialogs/SetRewardsDialog";

export default {
  name: "App",
  components: {
    MoveFundsDialog,
    SetRewardsDialog
  }
};
</script>
