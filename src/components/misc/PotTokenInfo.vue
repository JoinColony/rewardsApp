<template>
  <fragment>
    <q-item-section>
      <q-item-label class="ellipsis" style="width: 150px">
        Token: {{ token.token }}
      </q-item-label>
      <q-item-label v-if="!rewardInfo" caption class="q-pt-sm">
        No current reward distribution
      </q-item-label>
      <q-item-label v-else caption class="q-pt-sm text-primary">
        Active Rewards Distribution
      </q-item-label>
    </q-item-section>

    <q-item-section side center>
      <q-chip
        v-if="token.token === '0x0000000000000000000000000000000000000000'"
        color="secondary"
        :label="$web3.utils.fromWei(token.balance) + ' ETH'"
        size="md"
        outline
        icon-right="fab fa-ethereum"
      />
      <q-chip
        v-else
        color="secondary"
        :label="$web3.utils.fromWei(token.balance)"
        size="md"
        outline
      />
    </q-item-section>
  </fragment>
</template>

<script>
export default {
  props: {
    token: {
      type: Object
    }
  },
  computed: {
    rewardInfo() {
      return this.$store.getters["app/rewardPayoutInfo"](
        this.$props.token.token
      );
    }
  }
};
</script>

<style lang="scss" scoped></style>
