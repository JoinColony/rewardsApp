<template>
  <q-dialog v-if="token != '0x0'" v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section>
        <div
          class="text-h6 ellipsis q-pr-md"
          style="width: 100px; display: inline-block; vertical-align: bottom;"
        >
          {{ token.token }}
        </div>
        <span class="text-h6">Reward Distribution</span>
      </q-card-section>
      <q-card-section align="right">
        There is <strong>{{ $web3.utils.fromWei(token.balance) }}</strong>
        <div
          class="ellipsis q-mx-xs"
          style="display: inline-block; width: 75px; vertical-align: middle"
        >
          {{ token.token }}
        </div>
        in the reward pot.
      </q-card-section>
      <q-card-section align="right">
        Your share of the reward pot is:
      </q-card-section>
      <q-card-section align="right">
        <strong style="vertical-align: middle">{{ token.payout }}</strong>
        <div
          class="q-mx-sm ellipsis"
          style="display: inline-block; width: 75px; vertical-align: middle"
        >
          {{ token.token }}
        </div>
        <q-icon
          v-if="token.token === '0x0000000000000000000000000000000000000000'"
          name="fab fa-ethereum"
          color="black"
          align="right"
          size="md"
        />
      </q-card-section>

      <q-card-actions align="right">
        <!-- <q-btn flat label="Cancel" color="primary" v-close-popup /> -->
        <q-btn
          v-if="hasRootRole && !rewardInfo"
          no-caps
          label="New Distribution"
          color="secondary"
          icon="account_balance_wallet"
          @click="submit"
          class="no-shadow q-ma-sm"
        />
        <q-btn
          v-if="rewardInfo"
          no-caps
          label="Waive"
          color="negative"
          icon="account_balance_wallet"
          @click="waive"
          class="no-shadow q-ma-sm"
        />
        <q-btn
          v-if="rewardInfo"
          no-caps
          label="Claim"
          color="secondary"
          icon="account_balance_wallet"
          @click="claim"
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
