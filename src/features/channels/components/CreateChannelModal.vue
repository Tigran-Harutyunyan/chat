<script setup lang="ts">
import { ref } from "vue";
import { storeToRefs } from "pinia";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useClerkUser } from "@/composables/useClerkUser";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";
import { useCreateChannel } from "@/features/channels/api/useCreateChannel";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

const { onClose } = useCreateChannelModal();
const { isOpen } = storeToRefs(useCreateChannelModal());
const { email } = useClerkUser();
const channelName = ref("");
const { workspaceId } = useWorkspaceId();
const { mutate, isLoading } = useCreateChannel(workspaceId.value);

const handleSubmit = () => {
  mutate({ name: channelName.value, email, workspaceId: workspaceId.value });
  onClose();
  channelName.value = "";
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="onClose()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add a channel</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <Input
          v-model="channelName"
          :disabled="isLoading"
          required
          autoFocus
          :minLength="3"
          :maxLength="80"
          placeholder="e.g. plan-budget"
        />
        <div class="flex justify-end">
          <Button :disabled="isLoading" :is-loading="isLoading">
            Create
          </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
