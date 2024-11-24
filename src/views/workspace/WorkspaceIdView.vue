<script setup lang="ts">
import { computed, watchEffect, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { Loader, TriangleAlert } from "lucide-vue-next";
import { useGetChannels } from "@/features/workspace/api/useGetChannels";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useClerkUser } from "@/composables/useClerkUser";
import { useGetWorkspace } from "@/features/workspace/api/useGetWorkspace";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";

const { workspaceId } = useWorkspaceId();
const { email } = useClerkUser();
const { onOpen, onClose } = useCreateChannelModal();
const { isOpen } = storeToRefs(useCreateChannelModal());
const router = useRouter();

const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
  id: workspaceId.value,
  email,
});

const { data: channels, isLoading: channelsLoading } = useGetChannels(
  workspaceId.value
);

const { data: member, isLoading: memberLoading } = useCurrentMember(
  workspaceId.value
);

const isLoading = computed(() => {
  return workspaceLoading || channelsLoading || memberLoading;
});

const isAdmin = computed(() => member?.value?.role === "admin");
const channelId = computed(() => channels?.value?.[0]?._id);

watchEffect(() => {
  if (!isLoading.value) return;
  if (!member?.value || !workspace?.value) return;

  if (workspaceId.value && channelId.value) {
    router.push(`/workspace/${workspaceId.value}/channel/${channelId.value}`);
    return;
  }

  if (isAdmin.value && !channels?.value?.length && !isOpen.value) {
    onOpen();
  }
});

onUnmounted(() => {
  if (isOpen.value) {
    onClose();
  }
});
</script>

<template>
  <div
    v-if="isLoading"
    class="h-full flex-1 flex items-center justify-center flex-col gap-2"
  >
    <Loader class="size-6 animate-spin text-muted-foreground" />
  </div>
  <template v-else>
    <div
      v-if="!workspace || !member"
      class="h-full flex-1 flex items-center justify-center flex-col gap-2"
    >
      <TriangleAlert class="size-6 text-muted-foreground" />
      <span class="text-sm text-muted-foreground"> Workspace not found </span>
    </div>
    <div
      v-else
      class="h-full flex-1 flex items-center justify-center flex-col gap-2"
    >
      <TriangleAlert class="size-6 text-muted-foreground" />
      <span class="text-sm text-muted-foreground"> No channel found </span>
    </div>
  </template>
</template>
