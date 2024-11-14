<script setup lang="ts">
import { useAuth } from "vue-clerk";
import { useRouteGuard } from "../composables/useRouteGuard";

const { userId, isLoaded } = useAuth();
const isAuthed = isLoaded.value && !!userId.value;
useRouteGuard(isAuthed);
</script>

<template>
  <slot></slot>
</template>
