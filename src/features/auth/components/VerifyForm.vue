<script setup lang="ts">
import { ref } from "vue";
import { useSignUp } from "vue-clerk";
import { useForm, configure } from "vee-validate";
import { verificationSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  PinInput,
  PinInputGroup,
  PinInputInput,
  PinInputSeparator,
} from "@/components/ui/pin-input";

defineProps<{
  email: string;
}>();

const { handleSubmit, validate, setFieldValue } = useForm({
  initialValues: {
    code: [],
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

const value = ref<string[]>([]);
const BOX_COUNT = 6;

const handleVerify = handleSubmit(async (values) => {
  if (!isLoaded.value) return;

  if (!validate()) return;

  emit("onError", "");

  isPending.value = true;

  try {
    const completeSignUp = await signUp.value?.attemptEmailAddressVerification({
      code: values.code.join("") + "",
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
  <h6 class="text-sm text-muted-foreground">
    Enter verification code sent to
    <span class="text-sky-700">"{{ email }}"</span>
  </h6>
  <form @submit.prevent="handleVerify" class="space-y-2.5">
    <FormField name="code" v-slot="{ componentField }">
      <FormItem>
        <FormControl>
          <PinInput
            id="pin-input"
            v-model="value"
            placeholder="○"
            otp
            type="number"
            :name="componentField.code"
            @update:model-value="
              (arrStr) => {
                setFieldValue('code', arrStr.filter(Boolean));
              }
            "
          >
            <PinInputGroup class="gap-1">
              <template v-for="(id, index) in BOX_COUNT" :key="id">
                <PinInputInput class="rounded-md border" :index="index" />
              </template>
            </PinInputGroup>
          </PinInput>
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>
    <Button
      type="submit"
      class="w-full"
      size="lg"
      :disabled="isPending"
      :is-loading="isPending"
    >
      Complete Sign Up
    </Button>
  </form>
</template>
