<template>
  <q-dialog v-model="isOpen" :persistent="loading">
    <q-card style="width: 300px">
      <q-card-section>
        <div class="text-h6">Move Funds</div>
      </q-card-section>

      <q-card-section>
        <q-select
          label="From"
          v-model="fromPotValue"
          :options="fromOptions"
          map-options
          color="secondary"
          @input="getBudget"
        />
        <div class="text-caption" align="right">
          Budget: {{ budget }} {{ token.label }}
        </div>

        <div class="text-center full-width">
          <q-icon
            name="arrow_downward"
            size="lg"
            color="secondary"
            class="q-mt-xs"
          />
        </div>

        <q-field label="To" stack-label color="secondary"
          ><template v-slot:control>Rewards Pot</template>
        </q-field>
        <!-- <div class="text-caption" align="right">Budget: {{ budget }}</div> -->

        <div class="row q-mt-xs q-col-gutter-sm">
          <q-input
            label="Amount"
            v-model="amount"
            @keyup.enter="submit"
            class="col-8"
            placeholder="0.00"
            type="number"
            color="secondary"
            :step="0.05"
          >
            <template v-slot:append>
              <q-btn @click="amount = budget">Max</q-btn>
            </template>
          </q-input>
          <q-select
            v-model="token"
            :options="nonRewardPotTokens"
            label="Token"
            class="col-4"
            color="secondary"
            @input="getBudget"
            autofocus
          />
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
      fromPot: { value: 1 },
      amount: "",
      token: "Choose",
      loading: false,
      budget: "0"
    };
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
    fromOptions() {
      return this.$store.state.app.domains.map(domain => ({
        label: "Funding Pot " + domain.potId,
        value: domain.potId
      }));
    },
    nonRewardPotTokens() {
      return this.$store.state.app.nonRewardPotTokens.map(token => ({
        label: token.symbol,
        value: token.token
      }));
    },
    // TODO: Use filter instead of computed prop
    fromPotValue: {
      get() {
        return this.fromPot.value;
      },
      set(_fromPot) {
        this.fromPot = _fromPot;
      }
    }
  },
  methods: {
    async submit() {
      this.loading = true;

      try {
        await this.$store.dispatch("app/moveFunds", {
          fromPot: this.fromPot.value,
          toPot: 0,
          amount: this.amount,
          token: this.token
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully moved funds."
        });

        this.$store.commit("app/toggleMoveFundsDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }

      this.loading = false;
    },
    async getBudget() {
      const colonyClient = this.$store.state.app.colonyClient;

      const { balance } = await colonyClient.getFundingPotBalance.call({
        potId: this.fromPot.value,
        token: this.token.value
      });

      this.budget = this.$web3.utils.fromWei(balance.toString());
    }
  }
};
</script>
