<script setup lang="ts">
import { watch } from "vue";
import { useRouter } from "vue-router";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { useGetWorkspaces } from "@/features/workspace/api/useGetWorkspaces";
import { useCreateWorkspaceModal } from "@/features/workspace/store/useCreateWorkspaceModal";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

const router = useRouter();
const { onOpen } = useCreateWorkspaceModal();
const { data } = useGetWorkspaces();
const { workspaceId } = useWorkspaceId();
watch(
  () => data.value,
  () => {
    if (Array.isArray(data.value)) {
      if (!data.value.length) {
        onOpen();
        return;
      }

      if (!workspaceId.value) {
        const id = data.value[0]?._id;
        router.push(`/workspace/${id}`);
      }
    }
  },
  {
    immediate: true,
  }
);
</script>

<template>
  <DashboardLayout> </DashboardLayout>
</template>
