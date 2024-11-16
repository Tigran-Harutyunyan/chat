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
import { useCreateWorkspaceModal } from "@/features/workspace/store/useCreateWorkspaceModal";
import { useCreateWorkspace } from "@/features/workspace/api/useCreateWorkspace";

const { onClose } = useCreateWorkspaceModal();
const { isOpen } = storeToRefs(useCreateWorkspaceModal());
const { mutate, isLoading } = useCreateWorkspace();
const { email } = useClerkUser();
const workspaceName = ref("");

const handleSubmit = () => {
  mutate({ name: workspaceName.value, email });
  onClose();
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="onClose()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Add a workspace</DialogTitle>
      </DialogHeader>
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <Input
          v-model="workspaceName"
          :disabled="isLoading"
          required
          autoFocus
          :minLength="3"
          placeholder="Workspace name e.g. 'Work', 'Personal', 'Home'"
        />
        <div class="flex justify-end">
          <Button :disabled="isLoading"> Create </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
