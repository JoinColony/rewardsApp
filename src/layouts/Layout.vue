<template>
  <q-layout view="lhh Lpr lFf">
    <q-header class="transparent shadow-1">
      <q-toolbar>
        <q-toolbar-title>
          <q-btn to="/select-colony" no-caps flat>
            Colony Rewards Distribution
          </q-btn>
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "Layout"
};
</script>

<style lang="stylus" scoped>
.q-header {
  color: #000;
}

.q-page-container {
  background: linear-gradient(0deg, rgba(146, 216, 220, 0.1) 0%, rgba(246, 185, 185, 0.1) 100%) #F4F6FA;
}
</style>
