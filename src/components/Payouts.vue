<template>
  <div>
    <h6 class="q-mb-lg">Active Rewards Distributions</h6>

    <q-list separator bordered v-if="rewardPotTokens.length > 0">
      <q-item
        class="q-pa-md"
        v-for="token in rewardPotTokens"
        :key="token.payoutId"
        @click="openTokenDialog(token)"
        clickable
        v-ripple
      >
        <PayoutInfo :payout="token" />
      </q-item>

      <RewardDistributionDialog />
    </q-list>
    <div v-else>
      No active rewards distributions.
    </div>
  </div>
</template>

<script>
import PayoutInfo from "components/misc/PayoutInfo.vue";
import RewardDistributionDialog from "components/dialogs/RewardDistributionDialog";

export default {
  data() {
    return {
      currentToken: null
    };
  },
  computed: {
    rewardPotTokens() {
      return this.$store.state.app.rewardPayouts;
    }
  },
  methods: {
    openTokenDialog(token) {
      this.$store.commit("app/setSelectedToken", { token });
      this.$store.commit("app/toggleRewardDistributionDialog");
    }
  },
  components: {
    PayoutInfo,
    RewardDistributionDialog
  }
};
</script>

<style scoped>
.q-list {
  background-color: white;
  border-radius: 5px;
}
</style>
