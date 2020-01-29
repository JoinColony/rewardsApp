<template>
  <div class="items-sm-start">
    <h6 class="q-mb-lg">Rewards Pot Details</h6>
    <div>
      {{ rewardPercentage }}% of all incoming revenue is sent to the rewards
      pot.
    </div>

    <q-btn
      @click="$store.commit('app/toggleLockTokensDialog')"
      no-caps
      class="q-my-sm no-shadow"
      label="Lock/unlock your native tokens"
    />
    <LockTokensDialog />

    <q-btn
      v-if="hasFundingRole"
      @click="$store.commit('app/toggleMoveFundsDialog')"
      no-caps
      class="q-my-sm no-shadow"
      label="Move funds to rewards pot"
    />
    <MoveFundsDialog v-if="hasFundingRole" />

    <q-btn
      v-if="hasRootRole"
      @click="$store.commit('app/toggleSetRewardsDialog')"
      no-caps
      class="q-my-sm no-shadow"
      label="Set rewards percentage"
    />
    <SetRewardsDialog v-if="hasRootRole" />
  </div>
</template>

<script>
import MoveFundsDialog from "components/dialogs/MoveFundsDialog";
import SetRewardsDialog from "components/dialogs/SetRewardsDialog";
import LockTokensDialog from "components/dialogs/LockTokensDialog";

export default {
  computed: {
    rewardPercentage() {
      return this.$store.getters["app/getRewardPercentage"];
    },
    hasRootRole() {
      return this.$store.getters["app/getUser"].hasRootRole;
    },
    hasFundingRole() {
      return this.$store.getters["app/getUser"].hasFundingRole;
    }
  },
  components: {
    MoveFundsDialog,
    SetRewardsDialog,
    LockTokensDialog
  }
};
</script>

<style scoped>
.q-btn {
  background-color: white;
}
</style>
