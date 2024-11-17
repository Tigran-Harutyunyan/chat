<script setup lang="ts">
import { ref } from "vue";
import {
  ChevronDown,
  ListFilter,
  SquarePen,
  TrashIcon,
  Pencil,
  UserRoundPlus,
} from "lucide-vue-next";
import { Doc } from "../../../../convex/_generated/dataModel";
import Hint from "@/components/Hint.vue";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import EditWorkspaceModal from "@/features/workspace/components/EditWorkspaceModal.vue";
import InviteModal from "@/features/workspace/components/InviteModal.vue";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

import { useEditWorkspaceModal } from "@/features/workspace/store/useEditWorkspaceModal";
import { useDeleteWorkspace } from "@/features/workspace/api/useDeleteWorkspace";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useClerkUser } from "@/composables/useClerkUser";
import { useInviteModal } from "@/features/workspace/store/useInviteModal";

interface WorkspaceHeaderProps {
  workspace: Doc<"workspaces">;
  isAdmin: boolean;
}

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

defineProps<WorkspaceHeaderProps>();

const { onOpen } = useEditWorkspaceModal();

const { mutate, isLoading } = useDeleteWorkspace();
const { workspaceId } = useWorkspaceId();
const { email } = useClerkUser();
const { onOpen: onOpenInviteModal } = useInviteModal();

const showConfirm = async () => {
  const ok = await confirm.value?.openModal(
    "Are you sure?",
    "This action is irreversible."
  );

  if (!ok) return;

  mutate({
    email,
    id: workspaceId.value,
  });

  debugger;
};
</script>

<template>
  <InviteModal :name="workspace?.name" :join-code="workspace?.joinCode" />
  <EditWorkspaceModal :initialValue="workspace?.name" />
  <ConfirmDialog ref="confirm" />
  <div class="flex items-center justify-between px-4 h-[49px] gap-0.5">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button
          variant="transparent"
          class="font-semibold text-lg w-auto p-1.5 overflow-hidden"
          size="sm"
        >
          <span class="truncate">{{ workspace?.name }}</span>
          <ChevronDown class="size-4 ml-1 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="bottom" align="start" class="w-64">
        <DropdownMenuItem class="cursor-pointer capitalize">
          <div
            class="size-9 relative overflow-hidden bg-[#616061] text-white font-semibold text-xl rounded-md flex items-center justify-center mr-2"
          >
            {{ workspace?.name?.charAt(0).toUpperCase() }}
          </div>
          <div class="flex flex-col items-start">
            <p class="font-bold">{{ workspace?.name }}</p>
            <p class="text-xs text-muted-foreground">Active workspace</p>
          </div>
        </DropdownMenuItem>

        <template v-if="isAdmin">
          <DropdownMenuSeparator />
          <DropdownMenuItem
            class="cursor-pointer py-2"
            @click="onOpenInviteModal()"
          >
            <UserRoundPlus />Invite people to <b>{{ workspace?.name }}</b>
          </DropdownMenuItem>
          <DropdownMenuItem class="cursor-pointer py-2" @click="onOpen()">
            <Pencil /> Edit workspace
          </DropdownMenuItem>
          <DropdownMenuItem
            class="cursor-pointer py-2 text-red-500"
            @click="showConfirm()"
          >
            <TrashIcon />Delete workspace
          </DropdownMenuItem>
        </template>
      </DropdownMenuContent>
    </DropdownMenu>
    <div class="flex items-center gap-0.5">
      <Hint label="Filter conversations" side="bottom">
        <Button variant="transparent" size="iconSm">
          <ListFilter class="size-4" />
        </Button>
      </Hint>
      <Hint label="New message" side="bottom">
        <Button variant="transparent" size="iconSm">
          <SquarePen class="size-4" />
        </Button>
      </Hint>
    </div>
  </div>
</template>
