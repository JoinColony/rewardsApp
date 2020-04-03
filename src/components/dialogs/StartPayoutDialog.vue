<template>
  <q-dialog v-model="isOpen" :persistent="loading">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">Start Rewards Payout</div>
      </q-card-section>

      <q-card-section>
        <q-select
          v-model="token"
          :options="rewardPotTokens"
          label="Token"
          class="col-12"
          color="secondary"
          @input="getPotBalance"
          autofocus
        />
        <div class="text-caption" align="right">
          Pot Balance: {{ potBalance }} {{ token.label }}
        </div>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          no-caps
          color="secondary"
          label="Confirm"
          @click="submit"
          :loading="loading"
          class="no-shadow"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      token: "Choose Token",
      loading: false,
      potBalance: "0"
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.app.startPayoutDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/toggleStartPayoutDialog", _isOpen);
      }
    },
    rewardPotTokens() {
      return this.$store.state.app.rewardPotTokens.map(token => ({
        label: token.symbol,
        value: token.token
      }));
    }
  },
  methods: {
    async submit() {
      this.loading = true;

      try {
        await this.$store.dispatch("app/startNextRewardPayout", {
          token: this.token.value
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully started the rewards payout."
        });

        this.$store.commit("app/togglePayoutDialog");
      } catch ({ message }) {
        this.$q.notify({ color: "negative", message });
      }

      this.loading = false;
    },
    async getPotBalance() {
      const colonyClient = this.$store.state.app.colonyClient;

      const { balance } = await colonyClient.getFundingPotBalance.call({
        potId: 0,
        token: this.token.value
      });

      this.potBalance = this.$web3.utils.fromWei(balance.toString());
    }
  }
};
</script>
