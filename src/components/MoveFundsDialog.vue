<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Move Funds</div>
      </q-card-section>

      <q-card-section>
        <q-select label="From" v-model="fromPot" :options="fromOptions" />

        <div class="text-center full-width">
          <q-btn
            @click="swap"
            flat
            size="lg"
            icon="swap_vertical_circle"
            color="primary"
            class="q-my-xs"
          />
        </div>

        <q-select label="To" v-model="toPot" :options="toOptions" />

        <q-input
          label="Amount"
          v-model="amount"
          @keyup.enter="$store.commit('app/toggleMoveFundsDialog')"
        />
        <q-select v-model="token" :options="tokenOptions" label="Token" />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Cancel"
          @click="$store.commit('app/toggleMoveFundsDialog')"
          :disabled="loading"
        />
        <q-btn flat label="Confirm" @click="submit" :loading="loading" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      fromPot: 1,
      toPot: 0,
      amount: 0,
      fromOptions: [],
      toOptions: [],
      tokenToggle: false,
      token: "Choose a Token",
      loading: false
    };
  },
  created() {
    this.fromOptions = this.potIds;
    this.toOptions = [0];
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.app.moveFundsDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/toggleMoveFundsDialog", _isOpen);
      }
    },
    potIds() {
      return this.$store.getters["app/getDomains"].map(domain => domain.potId);
    },
    rewardPotTokens() {
      return this.$store.getters["app/getRewardPotTokens"].map(
        token => token.token
      );
    },
    nonRewardPotTokens() {
      return this.$store.getters["app/getNonRewardPotTokens"].map(
        token => token.token
      );
    },
    tokenOptions() {
      return this.tokenToggle ? this.rewardPotTokens : this.nonRewardPotTokens;
    }
  },
  methods: {
    swap() {
      const holdOptions = this.fromOptions;
      const holdValue = this.fromPot;
      this.fromOptions = this.toOptions;
      this.fromPot = this.toPot;
      this.toOptions = holdOptions;
      this.toPot = holdValue;
      this.amount = 0;
      this.tokenToggle = !this.tokenToggle;
      this.token = this.tokenOptions[0]
        ? this.tokenOptions[0]
        : "No Token Options";
    },
    async submit() {
      this.loading = true;
      await this.$store.dispatch("app/moveFunds", {
        fromPot: this.fromPot,
        toPot: this.toPot,
        amount: this.amount,
        token: this.token
      });
      this.loading = false;
    }
  }
};
</script>
