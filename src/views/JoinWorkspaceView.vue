<script setup lang="ts">
import { ref, watch } from "vue";
import { Loader } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import {
  PinInput,
  PinInputGroup,
  PinInputInput,
} from "@/components/ui/pin-input";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useClerkUser } from "@/composables/useClerkUser";
import { useJoin } from "@/features/workspace/api/useJoin";
import { useGetWorkspaceInfo } from "@/features/workspace/api/useGetWorkspaceInfo";
import { useRouter } from "vue-router";

const code = ref<string[]>([]);
const BOX_COUNT = 6;
const { workspaceId } = useWorkspaceId();
const { email } = useClerkUser();
const router = useRouter();
const { data, isLoading } = useGetWorkspaceInfo({
  id: workspaceId.value,
  email,
});

const { mutate } = useJoin();

const handleComplete = () => {
  mutate({
    email,
    joinCode: code.value.join(""),
    workspaceId: workspaceId.value,
  });
};

watch(
  () => data,
  () => {
    if (data?.value?.isMember) {
      router.push(`/workspace/${workspaceId.value}`);
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <div v-if="isLoading" class="h-full flex items-center justify-center">
    <Loader class="size-6 animate-spin text-muted-foreground" />
  </div>
  <div
    v-else
    class="h-full flex flex-col gap-y-8 items-center justify-center bg-white p-8 rounded-lg shadow-md"
  >
    <img src="/logo.svg" width="60" height="60" alt="Logo" />
    <div class="flex flex-col gap-y-4 items-center justify-center max-w-md">
      <div class="flex flex-col gap-y-2 items-center justify-center">
        <h1 class="text-2xl font-bold">Join {{ data?.name }}</h1>
        <p class="text-md text-muted-foreground">
          Enter the workspace code to join
        </p>
      </div>
      <PinInput
        id="pin-input"
        v-model="code"
        placeholder="○"
        otp
        @complete="handleComplete"
      >
        <PinInputGroup class="gap-1">
          <template v-for="item in BOX_COUNT" :key="item">
            <PinInputInput class="rounded-md border" :index="item" />
          </template>
        </PinInputGroup>
      </PinInput>
    </div>
    <div class="flex gap-x-4">
      <Button size="lg" variant="outline" as-child>
        <RouterLink to="/workspace"> Back to home </RouterLink>
      </Button>
    </div>
  </div>
</template>
