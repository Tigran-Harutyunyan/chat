<script setup lang="ts">
import { toast } from "vue-sonner";
import SignUpForm from "@/features/auth/components/SignUpForm.vue";
import VerifyForm from "@/features/auth/components/VerifyForm.vue";
import AuthLayout from "@/layouts/AuthLayout.vue";
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
import { useConvexMutation } from "@convex-vue/core";
import { api } from "@convex/api";

const isVerifying = ref(false);
const error = ref("");
const submitedEmail = ref("");
const router = useRouter();

const setError = (data: string) => {
  error.value = data;
};

const { mutate } = useConvexMutation(api.users.createUser, {
  onSuccess() {
    toast.success("Welcome!");
    router.push("/workspace");
  },
  onError(err) {
    error.value = err.message;
    isVerifying.value = false;
  },
});

const onVerificationSuccess = ({
  name,
  email,
}: {
  name: string;
  email: string;
}) => {
  mutate({
    email,
    name,
  });
};

const onSendEmail = (email: string) => {
  submitedEmail.value = email;
  isVerifying.value = true;
};
</script>

<template>
  <AuthLayout>
    <Card class="w-full h-full p-8">
      <CardHeader class="px-0 pt-0">
        <CardTitle> Sign up to continue </CardTitle>
        <CardDescription>
          {{ isVerifying ? "Code verification" : "Use your email to continue" }}
        </CardDescription>
      </CardHeader>

      <div
        v-if="!!error"
        class="bg-destructive/15 p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive mb-6"
      >
        <TriangleAlert class="size-4" />
        <p>{{ error }}</p>
      </div>

      <CardContent class="space-y-5 px-0 pb-0">
        <VerifyForm
          v-if="isVerifying"
          :email="submitedEmail"
          @onError="setError"
          @onVerified="onVerificationSuccess"
        />
        <SignUpForm v-else @onError="setError" @onVerify="onSendEmail" />
        <Separator />

        <p class="text-xs text-muted-foreground">
          Already have an account?
          <span
            @click="router.push({ path: '/sign-in' })"
            class="text-sky-700 hover:underline cursor-pointer"
            >Sign in</span
          >
        </p>
      </CardContent>
    </Card>
  </AuthLayout>
</template>
