<script setup lang="ts">
import { Loader2 } from "lucide-vue-next";
import { ClerkLoaded, ClerkLoading } from "vue-clerk";
</script>

<template>
  <ClerkLoading>
    <Loader2 class="h-8 w-8 animate-spin text-zinc-500" />
  </ClerkLoading>
  <ClerkLoaded>
    <RouterView />
  </ClerkLoaded>
</template>
