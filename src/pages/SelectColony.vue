<template>
  <q-page class="flex flex-center column">
    <div>
      <h3 class="q-mt-none">Select a Colony</h3>
      <q-input v-model="address" @keyup.enter="setColony" color="secondary" />
      <q-card-actions align="right">
        <q-btn
          @click="setColony"
          label="Confirm"
          class="no-shadow q-ma-sm"
          :loading="loading"
          color="secondary"
          no-caps
        />
      </q-card-actions>
    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      // address: "planex.colony.joincolony.test", // Planet Express
      address: "0x85d15CbD2a555FF48C80Dc56A4032e7bfcA11d46",
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
