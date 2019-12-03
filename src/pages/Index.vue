<template>
  <!-- eslint-disable -->
  <q-page class="flex flex-center column">
    <img class="q-pb-xl" alt="Colony logo" src="~assets/colony-logo-200x200.png" />
    <q-input v-model="colonyAddress" />
    <q-btn @click="setColony" label="Set Colony" />
    <p v-if="loading">Loading...</p>
    <div v-if="!loading && colonyClient">
      <p>
        <strong>Network:</strong>
      </p>
      <p>Network Address: {{ networkClient.contract.address }}</p>
      <p>Colony Address: {{ colonyClient.contract.address }}</p>
      <hr />
      <p>
        <strong>User:</strong>
      </p>
      <p>Wallet Address: {{ user.wallet.address }}</p>
      <p>Has Root Role?: {{ user.isRoot }}</p>
      <p>Has Funding Role?: {{ user.isFunding }}</p>
    </div>
    <p v-if="!loading && error">{{ error }}</p>
  </q-page>
</template>

<script>
import { getNetworkClient } from "@colony/colony-js-client";
import { open } from "@colony/purser-metamask";

export default {
  name: "PageIndex",
  data() {
    return {
      networkClient: null,
      colonyClient: null,
      colonyAddress: "",
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

      this.networkClient = await getNetworkClient("goerli", this.user.wallet);

      this.colonyClient = await this.networkClient.getColonyClientByAddress(
        "0x2ea0Ba4Aa2bcaDb4371Fcdc99C067a359DFeB870" // Krusty Krab
      );

      this.user.isRoot = (await this.colonyClient.hasColonyRole.call({
        address: this.user.wallet.address,
        domainId: 1,
        role: "ROOT"
      })).hasRole;

      this.user.isFunding = (await this.colonyClient.hasColonyRole.call({
        address: this.user.wallet.address,
        domainId: 1,
        role: "FUNDING"
      })).hasRole;

      this.loading = false;
    } catch (error) {
      this.error = error;
      this.loading = false;
    }
  },
  methods: {
    async setColony() {
      this.colonyClient = await this.networkClient.getColonyClientByAddress(
        this.colonyAddress
      );
    }
  }
};
</script>
