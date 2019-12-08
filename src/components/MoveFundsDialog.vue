<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Move Funds</div>
      </q-card-section>

      <q-card-section>
        <q-input
          label="From"
          v-model="from"
          autofocus
          @keyup.enter="$store.commit('app/toggleMoveFundsDialog')"
        />

        <q-input
          label="To"
          v-model="to"
          @keyup.enter="$store.commit('app/toggleMoveFundsDialog')"
        />

        <q-input
          label="Amount"
          v-model="amount"
          @keyup.enter="$store.commit('app/toggleMoveFundsDialog')"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Cancel"
          @click="$store.commit('app/toggleMoveFundsDialog')"
        />
        <q-btn
          flat
          label="Confirm"
          @click="$store.commit('app/toggleMoveFundsDialog')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      from: "",
      to: "",
      amount: 0
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
    }
  }
};
</script>
