<script setup lang="ts">
import { ref } from "vue";
import { useSignIn } from "vue-clerk";
import { useForm, configure } from "vee-validate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { loginSchema } from "../schemas";
import { useRouter } from "vue-router";

const router = useRouter();

type EmitType = {
  (event: "onError", value: string): void;
};

const emit = defineEmits<EmitType>();

const { handleSubmit, validate } = useForm({
  initialValues: {
    emailAddress: "",
    password: "",
  },
  validationSchema: loginSchema,
});

configure({
  validateOnBlur: false,
});

const { isLoaded, signIn, setActive } = useSignIn();
const isPending = ref(false);

const signInWithEmail = handleSubmit(async (values) => {
  if (!isLoaded.value) {
    return;
  }

  if (!validate()) return;

  emit("onError", "");
  isPending.value = true;

  try {
    const result = await signIn.value?.create({
      identifier: values.emailAddress,
      password: values.password,
      strategy: "password",
    });
    if (result?.status === "complete") {
      await setActive.value?.({ session: result.createdSessionId });
      router.push("/workspace");
    }
  } catch (err: any) {
    emit("onError", err.errors[0].message);
  } finally {
    isPending.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="signInWithEmail" class="space-y-2.5">
    <FormField name="emailAddress" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Email address</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="email"
            placeholder="Enter email address"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="password" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="password"
            placeholder="Enter password"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full" size="lg" :disabled="isPending">
      {{ isPending ? "Wait..." : "Continue" }}
    </Button>
  </form>
</template>
