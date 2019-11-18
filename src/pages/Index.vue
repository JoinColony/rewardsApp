<template>
  <q-page class="flex flex-center column">
    <img class="q-pb-xl" alt="Quasar logo" src="~assets/quasar-logo-full.svg" />
    <p v-if="loading">loading...</p>
    <div v-if="!loading && colonyClient">
      <p><strong>Network:</strong></p>
      <p>Network Address: {{ colonyClient.networkClient.contract.address }}</p>
      <p>Colony Address: {{ colonyClient.contract.address }}</p>
      <hr />
      <p><strong>User:</strong></p>
      <p>Wallet Address: {{ user.wallet.address }}</p>
      <p>Has Root Role?: {{ user.isRoot }}</p>
      <p>Has Funding Role?: {{ user.isFunding }}</p>
    </div>
    <p v-if="!loading && error">{{ error }}</p>
  </q-page>
</template>

<script>
import { getColonyClient } from "@colony/colony-js-client";
import { open } from "@colony/purser-metamask";

export default {
  name: "PageIndex",
  data() {
    return {
      colonyClient: null,
      loading: true,
      error: null,
      user: {
        wallet: null,
        isRoot: false,
        isFunding: false
      }
    };
  },
  async created() {
    try {
      this.user.wallet = await open();

      this.colonyClient = await getColonyClient(
        // The address of the first colony created with `yarn colony-setup`
        "0x0a0e9A5781B26D9450D5e1D53aBB3dA887a67d7F",
        "local",
        this.user.wallet
      );

      this.user.isRoot = (
        await this.colonyClient.hasColonyRole.call({
          address: this.user.wallet.address,
          domainId: 1,
          role: "ROOT"
        })
      ).hasRole;

      this.user.isFunding = (
        await this.colonyClient.hasColonyRole.call({
          address: this.user.wallet.address,
          domainId: 1,
          role: "FUNDING"
        })
      ).hasRole;

      this.loading = false;
    } catch (error) {
      this.error = error;
      this.loading = false;
    }
  },
  methods: {
    async setColony(address) {
      this.colonyClient = await getColonyClient(
        address,
        "local",
        this.user.wallet
      );
    }
  }
};
</script>
