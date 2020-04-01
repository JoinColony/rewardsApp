<template>
  <fragment>
    <q-item-section>
      <div class="row">
        <q-item-label class="text-weight-medium q-mr-md">
          {{ token.name }}
        </q-item-label>
        <q-item-label
          v-if="token.token !== '0x0000000000000000000000000000000000000000'"
          class="ellipsis"
          style="width: 64px; margin-top: 0;"
        >
          {{ token.token }}
        </q-item-label>
      </div>
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
        :label="`${$web3.utils.fromWei(token.balance)} ${token.symbol}`"
        size="md"
        outline
      />
    </q-item-section>
  </fragment>
</template>

<script>
export default {
  props: {
    payout: {
      type: Object
    }
  },
  computed: {
    token() {
      return this.$store.getters["app/payoutToken"](
        this.$props.payout.tokenAddress
      );
    }
  }
};
</script>
