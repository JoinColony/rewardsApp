<template>
  <q-dialog v-model="isOpen">
    <q-card style="min-width: 350px">
      <q-card-section>
        <div class="text-h6">Set Rewards Percentage</div>
      </q-card-section>

      <q-card-section>
        <q-input
          label="Amount"
          v-model="rewardPercentage"
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
        <q-btn flat label="Confirm" @click="submit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  data() {
    return {
      rewardPercentage: 0
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
  },
  methods: {
    submit() {
      this.$store.dispatch("app/setRewardInverse", {
        rewardPercentage: this.rewardPercentage
      });
    }
  }
};
</script>
