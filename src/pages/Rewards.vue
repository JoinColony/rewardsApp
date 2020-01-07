<template>
  <q-page class="flex justify-center">
    <div class="row self-start" style="width: 1024px;">
      <PotBalances class="q-px-md col-12 col-sm-8" />
      <PotDetails class="q-px-md col-12 col-sm-4 column" />
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
