<script setup lang="ts">
import { ref } from "vue";
import { useSignUp } from "vue-clerk";
import { useForm, configure } from "vee-validate";
import { registerSchema } from "../schemas";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

type EmitType = {
  (event: "onError", value: string): void;
  (event: "onVerify", value: string): void;
};

const emit = defineEmits<EmitType>();

const { handleSubmit, validate } = useForm({
  initialValues: {
    firstName: "",
    lastName: "",
    emailAddress: "",
    password: "",
    confirmPassword: "",
  },
  validationSchema: registerSchema,
});

configure({
  validateOnBlur: false,
});

const { signUp, isLoaded } = useSignUp();
const isPending = ref(false);

const signUpWithEmail = handleSubmit(async (values) => {
  if (!isLoaded.value) {
    return;
  }

  if (!validate()) return;

  emit("onError", "");
  isPending.value = true;

  try {
    await signUp.value?.create({
      emailAddress: values.emailAddress,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
    });

    // send the email.
    await signUp.value?.prepareEmailAddressVerification({
      strategy: "email_code",
    });

    emit("onVerify", values.emailAddress);
  } catch (err: any) {
    emit("onError", err.errors[0].message);
  } finally {
    isPending.value = false;
  }
});
</script>

<template>
  <form @submit.prevent="signUpWithEmail" class="space-y-2.5">
    <FormField name="firstName" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>First name</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="text"
            placeholder="Enter your first name"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="lastName" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Last name</FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="text"
            placeholder="Enter your last name"
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField name="emailAddress" v-slot="{ componentField }">
      <FormItem>
        <FormLabel> Email address </FormLabel>
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
        <FormLabel>Password </FormLabel>
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

    <FormField name="confirmPassword" v-slot="{ componentField }">
      <FormItem>
        <FormLabel>Confirm Password </FormLabel>
        <FormControl>
          <Input
            v-bind="componentField"
            type="password"
            placeholder="Confirm password"
          />
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
      Continue
    </Button>
  </form>
</template>
