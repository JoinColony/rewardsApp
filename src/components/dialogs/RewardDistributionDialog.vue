<template>
  <q-dialog v-if="token != '0x0'" v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section>
        <span class="text-subtitle1 text-weight-medium">
          {{ token.name }} Rewards Distribution
        </span>
      </q-card-section>
      <q-card-section align="right">
        There is
        <strong>
          {{ $web3.utils.fromWei(token.balance) }} {{ token.symbol }}
        </strong>
        in the rewards pot.
      </q-card-section>
      <q-card-section align="right">
        Your share of the rewards pot is:
      </q-card-section>
      <q-card-section align="right">
        <strong> {{ token.payout }} {{ token.symbol }} </strong>
        <q-icon
          v-if="token.token === '0x0000000000000000000000000000000000000000'"
          name="fab fa-ethereum"
          color="black"
          size="sm"
        />
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <q-btn
          v-if="hasRootRole && !rewardInfo"
          no-caps
          color="secondary"
          @click="submit"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          New Distribution
        </q-btn>
        <q-btn
          no-caps
          v-if="rewardInfo"
          color="negative"
          @click="waive"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Waive
        </q-btn>
        <q-btn
          no-caps
          v-if="rewardInfo"
          color="secondary"
          @click="claim"
          class="no-shadow"
        >
          <q-icon left size="xs" name="account_balance_wallet" />
          Claim
        </q-btn>
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
    },
    hasRootRole() {
      return this.$store.getters["app/getUser"].hasRootRole;
    },
    rewardInfo() {
      return this.$store.getters["app/rewardPayoutInfo"](this.token.token);
    }
  },
  methods: {
    async submit() {
      try {
        await this.$store.dispatch("app/startNextRewardPayout", {
          token: this.token.token
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
    },
    async claim() {},
    async waive() {}
  }
};
</script>
