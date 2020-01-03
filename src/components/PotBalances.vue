<template>
  <q-list>
    <h6>Reward Pot Balances</h6>
    <div v-if="rewardPotTokens.length > 0">
      <q-list
        separator
        bordered
        style="background-color: white; border-radius: 5px;"
      >
        <q-item
          class="q-pa-md"
          v-for="token in rewardPotTokens"
          :key="token.token"
          @click="$store.commit('app/toggleRewardDistributionDialog', token)"
          clickable
          v-ripple
        >
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
            <q-badge
              color="secondary"
              :label="$web3.utils.fromWei(token.balance)"
            />
          </q-item-section>
          <RewardDistributionDialog :token="token" />
        </q-item>
      </q-list>
    </div>
    <div v-else>
      No tokens in the Reward Pot
    </div>
  </q-list>
</template>

<script>
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
  components: {
    RewardDistributionDialog
  }
};
</script>
