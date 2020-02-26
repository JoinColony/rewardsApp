<template>
  <q-page class="flex flex-center column">
    <h3 class="q-mt-none">Please login with Metamask</h3>
  </q-page>
</template>

<script>
export default {
  async created() {
    try {
      await this.$store.dispatch("app/openWallet");
      await this.$store.dispatch("app/setNetworkClient");
      this.$router.push("/colony");
    } catch (error) {
      const { message } = error;
      this.$q.notify({
        message,
        color: "negative"
      });
    }
  }
};
</script>
