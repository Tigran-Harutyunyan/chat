<script setup lang="ts">
import { useAuthGuard } from "../composables/useAuthGuard";
import { useAuth } from "vue-clerk";

const { userId, isLoaded } = useAuth();
const isAuthed = isLoaded.value && !!userId.value;
useAuthGuard(isAuthed);
</script>

<template>
  <div class="h-full flex items-center justify-center bg-[#5C3B58]">
    <div class="md:h-auto md:w-[420px]">
      <slot />
    </div>
  </div>
</template>
