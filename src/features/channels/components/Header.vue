<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { TrashIcon, Pencil } from "lucide-vue-next";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import ConfirmDialog from "@/components/ConfirmDialog.vue";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useChannelId } from "@/features/channels/hooks/useChannelId";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useUpdateChannel } from "@/features/channels/api/useUpdateChannel";
import { useRemoveChannel } from "@/features/channels/api/useRemoveChannel";
import { useGetChannels } from "@/features/workspace/api/useGetChannels";
import { useClerkUser } from "@/composables/useClerkUser";

interface HeaderProps {
  title: string;
}

const props = defineProps<HeaderProps>();

const confirm = ref<InstanceType<typeof ConfirmDialog> | null>(null);
const channelName = ref(props.title);
const isEditOpen = ref(false);
const router = useRouter();

const { email } = useClerkUser();
const { channelId } = useChannelId();
const { workspaceId } = useWorkspaceId();

const { data: member } = useCurrentMember(workspaceId.value);
const { data: channels } = useGetChannels(workspaceId.value);
const { mutate: updateChannel, isLoading: isUpdatingChannel } =
  useUpdateChannel(() => {
    isEditOpen.value = false;
  });
const { mutate: removeChannel, isLoading: isRemovingChannel } =
  useRemoveChannel((deletedId: string) => {
    const filtered = channels?.value.filter((chan) => chan._id !== deletedId);

    if (filtered?.length) {
      router.push(`/workspace/${workspaceId.value}/channel/${filtered[0]._id}`);
    } else {
      router.push(`/workspace/${workspaceId.value}`);
    }
  });

const handleisEditOpen = (value: boolean) => {
  if (member?.value?.role !== "admin") return;
  isEditOpen.value = value;
};

const handleSubmit = () => {
  if (!channelName.value) return;
  updateChannel({
    email,
    name: channelName.value,
    id: channelId.value,
  });
};

const handleDelete = async () => {
  if (isRemovingChannel.value) return;

  const ok = await confirm.value?.openModal(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible"
  );

  if (!ok) {
    return;
  }

  removeChannel({
    email,
    id: channelId.value,
  });
};
</script>

<template>
  <div
    class="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden"
  >
    <ConfirmDialog ref="confirm" />
    <div
      class="text-lg font-semibold px-2 overflow-hidden w-auto flex items-center"
    >
      <span class="truncate"># {{ title }}</span>

      <Button
        variant="ghost"
        size="iconSm"
        class="ml-2"
        @click="isEditOpen = true"
      >
        <Pencil class="size-4" />
      </Button>

      <Button
        v-if="member?.role === 'admin'"
        variant="ghost"
        size="iconSm"
        @click="handleDelete()"
      >
        <TrashIcon class="size-4" />
      </Button>
    </div>

    <Dialog :open="isEditOpen" @update:open="handleisEditOpen">
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename this channel</DialogTitle>
        </DialogHeader>
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <Input
            v-model="channelName"
            :disabled="isUpdatingChannel"
            required
            autoFocus
            :minLength="3"
            :maxLength="80"
            placeholder="e.g. plan-budget"
          />
          <DialogFooter>
            <DialogClose as-child>
              <Button variant="outline" :disabled="isUpdatingChannel">
                Cancel
              </Button>
            </DialogClose>
            <Button :disabled="isUpdatingChannel"> Save </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  </div>
</template>
