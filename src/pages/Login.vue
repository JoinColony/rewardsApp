<template>
  <q-page class="flex flex-center column">
    <h3>Please login with Metamask</h3>
  </q-page>
</template>

<script>
export default {
  async created() {
    try {
      await this.$store.dispatch("app/openWallet");
      await this.$store.dispatch("app/setNetworkClient");
      this.$router.push("/select-colony");
    } catch (error) {
      this.$q.notify(error);
    }
  }
};
</script>
