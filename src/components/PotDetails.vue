<template>
  <div>
    <h6>Reward Pot Details</h6>
    <div>5% of all incoming revenue is sent to the rewards pot.</div>

    <q-btn
      v-if="$store.getters['app/getUser'].hasFundingRole"
      @click="$store.commit('app/toggleMoveFundsDialog')"
      flat
      no-caps
      class="q-my-sm"
      label="Move funds"
    />
    <q-btn
      v-if="$store.getters['app/getUser'].hasRootRole"
      @click="$store.commit('app/toggleSetRewardsDialog')"
      flat
      no-caps
      class="q-my-sm"
      label="Set rewards percentage"
    />

    <MoveFundsDialog />
    <SetRewardsDialog />
  </div>
</template>

<script>
import MoveFundsDialog from "components/MoveFundsDialog";
import SetRewardsDialog from "components/SetRewardsDialog";

export default {
  components: {
    MoveFundsDialog,
    SetRewardsDialog
  }
};
</script>

<style lang="scss">
button > div {
  text-align: left !important;
}
</style>
