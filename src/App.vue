<script setup lang="ts">
import { Loader } from "lucide-vue-next";
import { ClerkLoaded, ClerkLoading } from "vue-clerk";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/AppLayout.vue";
</script>

<template>
  <ClerkLoading>
    <div class="h-full flex items-center justify-center">
      <Loader class="size-6 animate-spin text-muted-foreground" />
    </div>
  </ClerkLoading>
  <ClerkLoaded>
    <Toaster />
    <AppLayout />
  </ClerkLoaded>
</template>
