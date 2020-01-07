<template>
  <q-list>
    <h6>Reward Pot Balances</h6>

    <q-list
      separator
      bordered
      style="background-color: white; border-radius: 5px;"
      v-if="rewardPotTokens.length > 0"
    >
      <q-item
        class="q-pa-md"
        v-for="token in rewardPotTokens"
        :key="token.token"
        @click="openTokenDialog(token)"
        clickable
        v-ripple
      >
        <q-item-section>
          <q-item-label class="ellipsis" style="width: 150px">
            Token: {{ token.token }}
          </q-item-label>
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
          <q-chip
            color="secondary"
            :label="$web3.utils.fromWei(token.balance)"
            size="md"
            outline
            icon-right="fab fa-ethereum"
          />
        </q-item-section>
        <RewardDistributionDialog />
      </q-item>
    </q-list>
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
  methods: {
    openTokenDialog(token) {
      this.$store.commit("app/setSelectedToken", { token });
      this.$store.commit("app/toggleRewardDistributionDialog");
    }
  },
  components: {
    RewardDistributionDialog
  }
};
</script>
