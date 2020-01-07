<template>
  <q-dialog v-if="token != '0x0'" v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section class="row">
        <span class="col text-h6 ellipsis">{{ token.token }}</span>
        <span class="text-h6">Reward Distribution</span>
      </q-card-section>
      <q-card-section align="right">
        There is {{ $web3.utils.fromWei(token.balance) }} ETH in the reward pot.
      </q-card-section>
      <q-card-section align="right">
        Your share of the reward pot is:
      </q-card-section>
      <q-card-section align="right">
        <span class="q-mx-sm">{{ "TODO: Add Result" }} ETH</span>
        <q-icon name="fab fa-ethereum" color="black" align="right" size="md" />
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <q-btn
          v-if="$store.getters['app/getUser'].hasRootRole"
          no-caps
          label="New Distribution"
          color="secondary"
          icon="account_balance_wallet"
          @click="submit"
          class="no-shadow q-ma-sm"
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
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch("app/startNextRewardPayout", {
          token: this.token
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully started the reward payout."
        });

        this.$store.commit("app/toggleRewardDistributionDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }
    }
  }
};
</script>
