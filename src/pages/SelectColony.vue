<template>
  <q-page class="flex flex-center column">
    <div>
      <h3>Select a Colony</h3>
      <q-input v-model="address" @keyup.enter="setColony" />
      <q-btn
        @click="setColony"
        label="Confirm"
        class="q-mt-md"
        style="float: right;"
        :loading="loading"
      />
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      address: "kk.colony.joincolony.test", // Krusty Krab
      loading: false
    };
  },
  methods: {
    async setColony() {
      this.loading = true;
      try {
        await this.$store.dispatch("app/setColonyClient", {
          address: this.address
        });
        this.$router.push("/rewards");
      } catch (error) {
        const { message } = error;
        this.$q.notify({
          message,
          color: "negative"
        });
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>
