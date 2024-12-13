<script setup lang="ts">
import { Loader } from "lucide-vue-next";
import { useAuth, ClerkLoaded, ClerkLoading } from "vue-clerk";
import { Toaster } from "@/components/ui/sonner";
import AppLayout from "@/layouts/AppLayout.vue";
import { useRouter } from "vue-router";
import { watch } from "vue";
import { useUser } from "@/store/useUser";

const router = useRouter();
const { isSignedIn } = useAuth();
const { setSignedIn } = useUser();

watch(
  () => isSignedIn.value,
  (newValue) => {
    if (newValue === undefined) return;

    setSignedIn(isSignedIn.value);

    if (!isSignedIn.value) {
      router.push("/sign-in");
    }
  }
);
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
