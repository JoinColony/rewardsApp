<template>
  <div>
    <h6 class="q-mb-lg">Active Reward Payouts</h6>

    <q-list separator bordered v-if="rewardPayouts.length">
      <q-item
        class="q-pa-md"
        v-for="payout in rewardPayouts"
        :key="payout.payoutId"
        @click="openPayoutDialog(payout)"
        :clickable="currentLockCount + 1 == payout.payoutId"
        :manual-focus="currentLockCount + 1 == payout.payoutId"
        :focused="currentLockCount + 1 == payout.payoutId"
        :disabled="currentLockCount + 1 != payout.payoutId"
        v-ripple
      >
        <PayoutInfo :payout="payout" />
      </q-item>

      <PayoutDialog />
    </q-list>
    <div v-else>
      No active reward payouts.
    </div>
  </div>
</template>

<script>
import PayoutInfo from "components/misc/PayoutInfo.vue";
import PayoutDialog from "components/dialogs/PayoutDialog";

export default {
  computed: {
    rewardPayouts() {
      return this.$store.getters["app/sortedRewardsPayouts"];
    },
    currentLockCount() {
      return this.$store.state.app.userLockId;
    }
  },
  methods: {
    openPayoutDialog(payout) {
      this.$store.commit("app/setSelectedPayout", { payout });
      this.$store.commit("app/togglePayoutDialog");
    }
  },
  components: {
    PayoutInfo,
    PayoutDialog
  }
};
</script>

<style>
.q-list {
  background-color: white;
  border-radius: 5px;
}
[disabled] {
  opacity: 0.3 !important;
}
</style>
