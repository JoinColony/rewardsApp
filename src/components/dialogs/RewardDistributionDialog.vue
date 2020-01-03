<template>
  <q-dialog v-model="isOpen" :persistent="loading">
    <q-card class="q-pa-sm">
      <q-card-section class="row">
        <span class="col text-h6 ellipsis">{{ token }}</span>
        <span class="text-h6">Rewards Distribution</span>
      </q-card-section>
      <q-card-section align="right">
        There is 5.35 ETH in the rewards pot.
      </q-card-section>
      <q-card-section align="right">
        Your share of the rewards pot is:
      </q-card-section>
      <q-card-section align="right">
        <span class="q-mx-sm">0.642 ETH</span>
        <q-icon name="fab fa-ethereum" color="black" align="right" size="md" />
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <q-btn
          no-caps
          label="New Distribution"
          color="primary"
          icon="account_balance_wallet"
          v-close-popup
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      loading: false
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.app.rewardDistributionDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/toggleRewardDistributionDialog", _isOpen);
      }
    },
    token() {
      return this.$store.state.app.selectedToken;
    }
  }
};
</script>
