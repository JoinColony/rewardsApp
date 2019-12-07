<template>
  <div>
    <h6>Reward Pot Details</h6>
    <div>5% of all incoming revenue is sent to the rewards pot.</div>

    <q-btn
      v-if="$store.getters['app/getUser'].isFunding"
      flat
      no-caps
      class="q-my-sm"
    >
      Move funds
    </q-btn>
    <q-btn
      v-if="$store.getters['app/getUser'].isRoot"
      flat
      no-caps
      class="q-my-sm"
    >
      Set rewards percentage
    </q-btn>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
button > div {
  text-align: left !important;
}
</style>
