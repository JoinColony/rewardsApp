<template>
  <q-list>
    <h6>Reward Pot Balances</h6>
    <div v-if="rewardPotTokens.length > 0">
      <q-item class="q-px-none">
        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption lines="2">
            Secondary line text. Lorem ipsum dolor sit amet, consectetur
            adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>5 min ago</q-item-label>
          <q-icon name="star" color="yellow" />
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item class="q-px-none">
        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>
            Secondary line text. Lorem ipsum dolor sit amet, consectetur
            adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-item-label caption>Voted!</q-item-label>
        </q-item-section>
      </q-item>

      <q-separator spaced />

      <q-item class="q-px-none">
        <q-item-section>
          <q-item-label>Single line item</q-item-label>
          <q-item-label caption>
            Secondary line text. Lorem ipsum dolor sit amet, consectetur
            adipiscit elit.
          </q-item-label>
        </q-item-section>

        <q-item-section side top>
          <q-badge color="teal" label="10k" />
        </q-item-section>
      </q-item>
    </div>
    <div v-else>
      No tokens in the Reward Pot
    </div>
  </q-list>
</template>

<script>
export default {
  computed: {
    rewardPotTokens() {
      return this.$store.getters["app/getRewardPotTokens"];
    }
  }
};
</script>
