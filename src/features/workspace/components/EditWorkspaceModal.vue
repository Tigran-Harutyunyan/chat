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
import { useEditWorkspaceModal } from "@/features/workspace/store/useEditWorkspaceModal";
import { useCreateWorkspace } from "@/features/workspace/api/useCreateWorkspace";

interface PreferencesModalProps {
  initialValue: string;
}

const props = defineProps<PreferencesModalProps>();

const workspaceName = ref(props.initialValue);

const { onClose } = useEditWorkspaceModal();
const { isOpen } = storeToRefs(useEditWorkspaceModal());
const { mutate, isLoading } = useCreateWorkspace();
const { email } = useClerkUser();

const handleSubmit = () => {
  mutate({ name: workspaceName.value, email });
  onClose();
  workspaceName.value = "";
};
</script>

<template>
  <Dialog :open="isOpen" @update:open="onClose()">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Edit workspace name</DialogTitle>
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
          <Button :disabled="isLoading" :is-loading="isLoading"> Save </Button>
        </div>
      </form>
    </DialogContent>
  </Dialog>
</template>
