<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
const route = useRoute();

const layout = computed(() => {
  const layout = route?.meta?.layout;

  if (layout) {
    switch (layout) {
      case "DashboardLayout":
        return DashboardLayout;
      case "AuthLayout":
        return AuthLayout;
      default:
        return "div";
    }
  }
  return "div";
});
</script>

<template>
  <component :is="layout">
    <RouterView />
  </component>
</template>
