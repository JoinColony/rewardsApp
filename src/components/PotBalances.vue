<template>
  <div>
    <h6 class="q-mb-lg">Reward Pot Balances</h6>

    <q-list separator bordered v-if="rewardPotTokens.length > 0">
      <q-item
        class="q-pa-md"
        v-for="token in rewardPotTokens"
        :key="token.token"
        @click="openTokenDialog(token)"
        clickable
        v-ripple
      >
        <PotTokenInfo :token="token" />
      </q-item>

      <RewardDistributionDialog />
    </q-list>
    <div v-else>
      No tokens in the Reward Pot
    </div>
  </div>
</template>

<script>
import PotTokenInfo from "components/misc/PotTokenInfo.vue";
import RewardDistributionDialog from "components/dialogs/RewardDistributionDialog";

export default {
  data() {
    return {
      currentToken: null
    };
  },
  computed: {
    rewardPotTokens() {
      return this.$store.getters["app/getRewardPotTokens"];
    }
  },
  methods: {
    openTokenDialog(token) {
      this.$store.commit("app/setSelectedToken", { token });
      this.$store.commit("app/toggleRewardDistributionDialog");
    }
  },
  components: {
    PotTokenInfo,
    RewardDistributionDialog
  }
};
</script>

<style scoped>
.q-list {
  background-color: white;
  border-radius: 5px;
}
</style>
