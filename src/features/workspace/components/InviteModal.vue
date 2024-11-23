<script setup lang="ts">
import { ref } from "vue";
import { toast } from "vue-sonner";
import { CopyIcon, RefreshCcw } from "lucide-vue-next";
import { storeToRefs } from "pinia";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useNewJoinCode } from "@/features/workspace/api/useNewJoinCode";
import { useInviteModal } from "@/features/workspace/store/useInviteModal";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useClerkUser } from "@/composables/useClerkUser";

interface InviteModalProps {
  name: string;
  joinCode: string;
}

defineProps<InviteModalProps>();

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);

const { workspaceId } = useWorkspaceId();
const { onClose, onOpen } = useInviteModal();
const { isOpen } = storeToRefs(useInviteModal());
const { email } = useClerkUser();
const { mutate, isLoading } = useNewJoinCode(() => {
  onOpen();
});

const handleCopy = () => {
  const inviteLink = `${window.location.origin}/join/${workspaceId.value}`;

  navigator.clipboard
    .writeText(inviteLink)
    .then(() => toast.success("Invite link copied to clipboard"));
};

const handleNewCode = async () => {
  onClose();
  const ok = await confirm.value?.openModal(
    "Are you sure?",
    "This will deactivate the current invite code and generate a new one."
  );

  if (!ok) {
    onOpen();
    return;
  }

  mutate({
    email,
    workspaceId: workspaceId.value,
  });
};
</script>

<template>
  <ConfirmDialog ref="confirm" />
  <Dialog :open="isOpen" @update:open="onClose()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Invite people to {{ name }}</DialogTitle>
        <DialogDescription>
          Use the code below to invite people to your workspace
        </DialogDescription>
      </DialogHeader>
      <div class="flex flex-col gap-y-4 items-center justify-center py-10">
        <p class="text-4xl font-bold tracking-widest uppercase">
          {{ joinCode }}
        </p>
        <Button @click="handleCopy" variant="ghost" size="sm">
          Copy link
          <CopyIcon class="size-4 ml-2" />
        </Button>
      </div>
      <div class="flex items-center justify-between w-full">
        <Button
          :disabled="isLoading"
          :is-loading="isLoading"
          @click="handleNewCode"
          variant="outline"
        >
          New code
          <RefreshCcw class="size-4 ml-2" />
        </Button>
        <DialogClose as-child>
          <Button>Close</Button>
        </DialogClose>
      </div>
    </DialogContent>
  </Dialog>
</template>
