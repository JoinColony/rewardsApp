<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          <q-btn to="/select-colony" no-caps flat>
            Colony Rewards Distribution
          </q-btn>
        </q-toolbar-title>
        <q-btn
          v-if="$route.path == '/rewards'"
          flat
          @click="drawerRight = !drawerRight"
          round
          dense
          icon="menu"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-drawer
      v-if="$route.path == '/rewards'"
      side="right"
      v-model="drawerRight"
      show-if-above
      bordered
      :width="200"
      :breakpoint="500"
      content-class="bg-grey-3"
    >
      <q-scroll-area class="fit">
        <div class="q-pa-sm">
          <div v-for="n in 50" :key="n">Drawer {{ n }} / 50</div>
        </div>
      </q-scroll-area>
    </q-drawer>
  </q-layout>
</template>

<script>
export default {
  name: "Layout",
  data() {
    return {
      drawerRight: false
    };
  }
};
</script>
