<script setup lang="ts">
import { AvatarFallback, type AvatarFallbackProps } from "radix-vue";

const props = defineProps<AvatarFallbackProps>();
</script>

<template>
  <AvatarFallback
    v-bind="props"
    class="flex h-full w-full items-center justify-center rounded-md bg-sky-500 text-white"
  >
    <slot />
  </AvatarFallback>
</template>
