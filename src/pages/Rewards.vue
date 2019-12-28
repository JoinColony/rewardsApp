<template>
  <q-page class="flex justify-center">
    <div class="row">
      <PotBalances class="q-px-md col-12 col-md-7" />
      <PotDetails class="q-px-md col-12 col-md-5" />
    </div>
  </q-page>
</template>

<script>
import PotBalances from "components/PotBalances";
import PotDetails from "components/PotDetails";

export default {
  components: {
    PotBalances,
    PotDetails
  }
};
</script>
