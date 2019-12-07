<template>
  <q-page class="flex flex-center column">
    <div class="row">
      <PotBalances class="col-9" />
      <PotDetails class="col-3" />
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
