<script setup lang="ts">
import { api } from "../../../../convex/_generated/api";
import { useConvexQuery } from "@convex-vue/core";

import { useRoute, useRouter } from "vue-router";
import { computed, watch, ref } from "vue";

import { Loader, Plus } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useClerkUser } from "@/composables/useClerkUser";
import { useCreateWorkspaceModal } from "@/features/workspace/store/useCreateWorkspaceModal";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const { email } = useClerkUser();
const { onOpen } = useCreateWorkspaceModal();
const { workspaceId } = useWorkspaceId();

const route = useRoute();
const router = useRouter();

const { data: workspaces, isLoading: workspaceLoading } = useConvexQuery(
  api.workspaces.get,
  {
    email,
  }
);

const filteredWorkspaces = computed(() => {
  if (!workspaceId.value) return [];
  return workspaces.value?.filter(
    (workspace) => workspace?._id !== workspaceId.value
  );
});

const activeWorkspace = computed(() => {
  if (!workspaceId.value) return null;
  return workspaces.value?.filter(
    (workspace) => workspace?._id === workspaceId.value
  )[0];
});
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        class="size-9 relative overflow-hidden bg-[#ABABAD] hover:bg-[#ABABAD]/80 text-slate-800 font-semibold text-xl"
      >
        <Loader v-if="workspaceLoading" class="size-5 animate-spin shrink-0" />
        <span v-else>
          {{ activeWorkspace?.name?.charAt(0).toUpperCase() }}</span
        >
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent side="bottom" align="start" class="w-64">
      <DropdownMenuItem
        @click="router.push(`/workspace/${workspaceId}`)"
        class="cursor-pointer flex-col justify-start items-start capitalize"
      >
        {{ activeWorkspace?.name }}
        <span class="text-xs text-muted-foreground">Active workspace</span>
      </DropdownMenuItem>

      <DropdownMenuItem
        v-for="workspace in filteredWorkspaces"
        :key="workspace._id"
        class="cursor-pointer capitalize overflow-hidden"
        @click="router.push(`/workspace/${workspace._id}`)"
      >
        <div
          class="shrink-0 size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-lg rounded-md flex items-center justify-center mr-2"
        >
          {{ workspace.name.charAt(0).toUpperCase() }}
        </div>
        <p class="truncate">{{ workspace.name }}</p>
      </DropdownMenuItem>

      <DropdownMenuItem class="cursor-pointer" @click="onOpen()">
        <div
          class="size-9 relative overflow-hidden bg-[#F2F2F2] text-slate-800 font-semibold text-lg rounded-md flex items-center justify-center mr-2"
        >
          <Plus />
        </div>
        Create a new workspace
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
