<script setup lang="ts">
import { ref } from "vue";
import { useSignUp } from "vue-clerk";
import { useForm, configure } from "vee-validate";
import { verificationSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const { handleSubmit, validate } = useForm({
  initialValues: {
    code: "",
  },
  validationSchema: verificationSchema,
});

configure({
  validateOnBlur: false,
});

type EmitType = {
  (event: "onError", value: string): void;
  (
    event: "onVerified",
    value: {
      name: string;
      email: string;
    }
  ): void;
};

const emit = defineEmits<EmitType>();

const { signUp, setActive, isLoaded } = useSignUp();
const isPending = ref(false);

const handleVerify = handleSubmit(async (values) => {
  if (!isLoaded.value) return;

  if (!validate()) return;

  emit("onError", "");
  isPending.value = true;

  try {
    const completeSignUp = await signUp.value?.attemptEmailAddressVerification({
      code: values.code + "",
    });

    if (completeSignUp && completeSignUp.status !== "complete") {
      console.log(JSON.stringify(completeSignUp, null, 2));
    }

    if (completeSignUp && completeSignUp.status === "complete") {
      await setActive.value?.({ session: completeSignUp.createdSessionId });

      if (completeSignUp.emailAddress) {
        emit("onVerified", {
          name: `${completeSignUp.firstName} ${completeSignUp.lastName}`,
          email: completeSignUp.emailAddress,
        });
      }
    }
  } catch (err) {
    if (
      err &&
      typeof err === "object" &&
      "errors" in err &&
      Array.isArray(err.errors)
    ) {
      const errors = err.errors
        .map((e) => {
          return e.longMessage;
        })
        .join(", ");
      emit("onError", JSON.stringify(errors, null, 2));
    } else {
      emit("onError", JSON.stringify(err, null, 2));
    }
  } finally {
    isPending.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="handleVerify" class="space-y-2.5">
    <FormField name="code" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Verification Code </FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="text"
            placeholder="Enter verification vode sent to your email box"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button type="submit" class="w-full" size="lg" :disabled="isPending">
      Complete Sign Up
    </Button>
  </form>
</template>
