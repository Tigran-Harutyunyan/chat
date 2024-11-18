<script setup lang="ts">
import { ref, computed, watch } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
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
const router = useRouter();
const { email } = useClerkUser();
const { onOpen } = useCreateChannelModal();
const { isOpen } = storeToRefs(useCreateChannelModal());

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
  return workspaceLoading.value || channelsLoading.value || memberLoading.value;
});

const isAdmin = computed(() => member?.value?.role === "admin");
const channelId = computed(() => channels?.value?.[0]?._id);

watch(
  () => isLoading.value,
  (newVal) => {
    if (newVal) return;
    if (!member.value || !workspace.value) return;

    if (channelId.value) {
      router.push(`/workspace/${workspaceId.value}/channel/${channelId.value}`);
    } else if (isAdmin.value && !isOpen.value) {
      onOpen();
    }
  }
);
</script>

<template>
  <DashboardLayout>
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
  </DashboardLayout>
</template>
