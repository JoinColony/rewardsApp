<template>
  <q-dialog v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section>
        <div class="text-h6">Move Funds</div>
      </q-card-section>

      <q-card-section>
        <q-select
          label="From"
          v-model="fromPotValue"
          :options="fromOptions"
          map-options
        />

        <div class="text-center full-width">
          <q-icon
            name="arrow_downward"
            size="lg"
            color="primary"
            class="q-mt-md"
          />
        </div>

        <q-select label="To" :value="0" :options="toOptions" map-options>
        </q-select>

        <div class="row q-pt-md">
          <q-input
            label="Amount"
            v-model="amount"
            @keyup.enter="submit"
            class="col-10"
            placeholder="0"
            type="number"
          />
          <q-select
            v-model="token"
            :options="nonRewardPotTokens"
            label="Token"
            class="col-2 ellipsis"
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
      toOptions: [{ label: "Reward Pot", value: 0 }],
      amount: "",
      token: "Choose a Token",
      loading: false
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
      return this.$store.getters["app/getDomains"].map(domain => ({
        label: "Funding Pot " + domain.potId,
        value: domain.potId
      }));
    },
    nonRewardPotTokens() {
      return this.$store.getters["app/getNonRewardPotTokens"].map(
        token => token.token
      );
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
    }
  }
};
</script>
