<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Set Rewards Percentage</div>
      </q-card-section>

      <q-card-section>
        <q-input
          label="Amount"
          v-model="amount"
          autofocus
          @keyup.enter="$store.commit('app/toggleSetRewardsDialog')"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
        <q-btn
          flat
          label="Cancel"
          @click="$store.commit('app/toggleSetRewardsDialog')"
        />
        <q-btn
          flat
          label="Confirm"
          @click="$store.commit('app/toggleSetRewardsDialog')"
        />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      amount: 0
    };
  },
  computed: {
    isOpen: {
      get() {
        return this.$store.state.app.setRewardsDialog;
      },
      set(_isOpen) {
        this.$store.commit("app/toggleSetRewardsDialog", _isOpen);
      }
    }
  }
};
</script>
