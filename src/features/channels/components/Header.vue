<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";
import { TrashIcon } from "lucide-vue-next";
import { FaChevronDown } from "vue3-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
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
const isPreferencesOpen = ref(false);
const router = useRouter();

const { email } = useClerkUser();
const { channelId } = useChannelId();
const { workspaceId } = useWorkspaceId();

const { data: member, isLoading: memberLoading } = useCurrentMember(
  workspaceId.value
);

const { data: channels, isLoading: channelsLoading } = useGetChannels(
  workspaceId.value
);

const { mutate: updateChannel, isPending: isUpdatingChannel } =
  useUpdateChannel(() => {
    isEditOpen.value = false;
  });

const { mutate: removeChannel, isPending: isRemovingChannel } =
  useRemoveChannel((deletedId: string) => {
    const filtered = channels.value.filter((chan) => chan._id !== deletedId);

    if (filtered?.length) {
      router.push(`/workspace/${workspaceId.value}/channel/${filtered[0]._id}`);
    } else {
      router.push(`/workspace/${workspaceId.value}`);
    }
  });

const handleisEditOpen = (value: boolean) => {
  if (member?.value.role !== "admin") return;
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
  isPreferencesOpen.value = false;

  const ok = await confirm.value?.openModal(
    "Delete this channel?",
    "You are about to delete this channel. This action is irreversible"
  );

  if (!ok) {
    isPreferencesOpen.value = true;
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
    <Dialog
      :open="isPreferencesOpen"
      @update:open="isPreferencesOpen = !isPreferencesOpen"
    >
      <DialogTrigger as-child>
        <Button
          variant="ghost"
          class="text-lg font-semibold px-2 overflow-hidden w-auto"
          size="sm"
        >
          <span class="truncate"># {{ title }}</span>
          <FaChevronDown class="size-2.5 ml-2" />
        </Button>
      </DialogTrigger>
      <DialogContent class="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader class="p-4 border-b bg-white">
          <DialogTitle> # {{ title }} </DialogTitle>
        </DialogHeader>
        <div class="px-4 pb-4 flex flex-col gap-y-2">
          <Dialog :open="isEditOpen" @update:open="handleisEditOpen">
            <DialogTrigger as-child>
              <div
                class="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50"
              >
                <div class="flex items-center justify-between">
                  <p class="text-sm font-semibold">Channel name</p>

                  <p
                    v-if="member?.role === 'admin'"
                    class="text-sm text-[#1264a3] hover:underline font-semibold"
                  >
                    Edit
                  </p>
                </div>
                <p class="text-sm"># {{ title }}</p>
              </div>
            </DialogTrigger>
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
          <button
            v-if="member?.role === 'admin'"
            @click="handleDelete()"
            :disabled="isRemovingChannel"
            class="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
          >
            <TrashIcon class="size-4" />
            <p class="text-sm font-semibold">Delete channel</p>
          </button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
