<template>
  <q-page class="flex flex-center column">
    <h3>Select a Colony</h3>
    <q-input v-model="address" />
    <q-btn @click="setColony" label="Confirm" />
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      address: "0x2ea0Ba4Aa2bcaDb4371Fcdc99C067a359DFeB870" // Krusty Krab
    };
  },
  methods: {
    async setColony() {
      this.$store.dispatch("app/setColonyClient", { address: this.address });
    }
  }
};
</script>
