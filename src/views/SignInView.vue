<script setup lang="ts">
import SignInForm from "@/features/auth/components/SignInForm.vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { TriangleAlert } from "lucide-vue-next";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const error = ref("");
const router = useRouter();

const setError = (data: string) => {
  error.value = data;
};
</script>

<template>
  <Card class="w-full h-full p-8">
    <CardHeader class="px-0 pt-0">
      <CardTitle> Login to continue </CardTitle>
      <CardDescription> Use your email to continue </CardDescription>
    </CardHeader>

    <div
      v-if="!!error"
      class="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6"
    >
      <TriangleAlert class="size-4" />
      <p>{{ error }}</p>
    </div>

    <CardContent class="space-y-5 px-0 pb-0">
      <SignInForm @onError="setError" />
      <Separator />

      <p class="text-xs text-muted-foreground">
        Don&apos;t have an account?
        <span
          @click="router.push({ path: '/sign-up' })"
          class="text-sky-700 hover:underline cursor-pointer"
          >Sign up</span
        >
      </p>
    </CardContent>
  </Card>
</template>
