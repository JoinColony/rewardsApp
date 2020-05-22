<template>
  <q-page class="flex flex-center column">
    <div>
      <h3 class="q-mt-none">Select a Colony</h3>
      <q-input
        v-model="name"
        @keyup.enter="setColony"
        color="secondary"
        placeholder="Colony Name"
      />
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
      // address: "speaketh.colony.joincolony.test", // SpeakETH
      name: "",
      loading: false
    };
  },
  methods: {
    async setColony() {
      this.loading = true;

      const address = await this.resolveENS();

      try {
        await this.$store.dispatch("app/setColonyClient", {
          address
        });
        this.$router.push("/payouts");
      } catch (error) {
        const { message } = error;
        this.$q.notify({
          message,
          color: "negative"
        });
      } finally {
        this.loading = false;
      }
    },
    async resolveENS() {
      return await this.$web3.eth.ens.getAddress(
        this.name + ".colony.joincolony.eth"
      );
    }
  }
};
</script>
