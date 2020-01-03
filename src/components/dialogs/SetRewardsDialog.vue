<template>
  <q-dialog v-model="isOpen" :persistent="loading">
    <q-card>
      <q-card-section>
        <div class="text-h6">Set Rewards Percentage</div>
      </q-card-section>

      <q-card-section>
        <q-input
          label="Amount"
          v-model="rewardPercentage"
          autofocus
          @keyup.enter="submit"
          :disable="loading"
          suffix="%"
          type="number"
          color="secondary"
        />
      </q-card-section>

      <q-card-actions align="right" class="text-primary">
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
      loading: false,
      rewardPercentage: ""
    };
  },
  mounted() {
    this.rewardPercentage = this.$store.getters["app/getRewardPercentage"];
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
    async submit() {
      this.loading = true;

      try {
        await this.$store.dispatch("app/setRewardInverse", {
          rewardPercentage: this.rewardPercentage
        });

        this.$q.notify({
          color: "positive",
          message: "Successfully updated reward percentage."
        });

        this.$store.commit("app/toggleSetRewardsDialog");
      } catch (error) {
        const { message } = error;
        this.$q.notify({ color: "negative", message });
      }

      this.loading = false;
    }
  }
};
</script>
