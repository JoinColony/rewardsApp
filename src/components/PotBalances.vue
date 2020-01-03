<template>
  <q-list>
    <h6>Reward Pot Balances</h6>
    <div v-if="rewardPotTokens.length > 0">
      <div
        v-for="token in rewardPotTokens"
        :key="token.token"
        @click="$store.commit('app/toggleRewardDistributionDialog', token)"
      >
        <q-item class="q-px-none">
          <q-item-section>
            <q-item-label>Token: {{ token.token }}</q-item-label>
            <q-item-label caption class="q-pt-sm">
              No current reward distribution
              <!-- <q-btn
                no-caps
                flat
                size="small"
                @click="
                  $store.commit('app/toggleRewardDistributionDialog', token)
                "
              >
                
              </q-btn> -->
            </q-item-label>
          </q-item-section>

          <q-item-section side center>
            <q-badge color="teal" :label="$web3.utils.fromWei(token.balance)" />
          </q-item-section>
        </q-item>

        <q-separator spaced />
      </div>
    </div>
    <div v-else>
      No tokens in the Reward Pot
    </div>
  </q-list>
</template>

<script>
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
  }
};
</script>
