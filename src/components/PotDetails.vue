<template>
  <div>
    <h6>Reward Pot Details</h6>
    <div>
      {{ rewardPercentage }}% of all incoming revenue is sent to the rewards
      pot.
    </div>

    <q-btn
      v-if="$store.getters['app/getUser'].hasFundingRole"
      @click="$store.commit('app/toggleMoveFundsDialog')"
      no-caps
      class="q-my-sm"
      label="Move funds"
    />
    <q-btn
      v-if="$store.getters['app/getUser'].hasRootRole"
      @click="$store.commit('app/toggleSetRewardsDialog')"
      no-caps
      class="q-my-sm"
      label="Set rewards percentage"
    />
  </div>
</template>

<script>
export default {
  computed: {
    rewardPercentage() {
      return this.$store.getters["app/getRewardPercentage"];
    }
  }
};
</script>

<style lang="scss">
button > div {
  text-align: left !important;
}
</style>
