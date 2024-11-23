<script setup lang="ts">
import { ref } from "vue";
import { Info, Search } from "lucide-vue-next";
import { Button } from "@/components/ui/button";
import { useRouter } from "vue-router";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useGetWorkspace } from "@/features/workspace/api/useGetWorkspace";
import { useGetChannels } from "@/features/workspace/api/useGetChannels";
import { useGetMembers } from "@/features/workspace/api/useGetMembers";
import { useClerkUser } from "@/composables/useClerkUser";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

const { workspaceId } = useWorkspaceId();
const router = useRouter();
const { email } = useClerkUser();

const { data: workspace } = useGetWorkspace({ id: workspaceId.value, email });
const { data: channels } = useGetChannels(workspaceId.value);
const { data: members } = useGetMembers(workspaceId.value);

const isOpen = ref(false);

const onChannelClick = (channelId: string) => {
  isOpen.value = false;
  router.push(`/workspace/${workspaceId.value}/channel/${channelId}`);
};

const onMemberClick = (memberId: string) => {
  isOpen.value = false;
  router.push(`/workspace/${workspaceId.value}/member/${memberId}`);
};
</script>

<template>
  <nav class="bg-[#481349] flex items-center justify-between h-10 p-1.5">
    <div class="flex-1" />
    <div class="min-w-[280px] max-[642px] grow-[2] shrink">
      <Button
        @click="isOpen = true"
        size="sm"
        class="bg-accent/25 hover:bg-accent-25 w-full justify-start h-7 px-2"
      >
        <Search class="size-4 text-white mr-2" />
        <span class="text-white text-xs"> Search {{ workspace?.name }} </span>
      </Button>
      <CommandDialog v-model:open="isOpen">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Channels">
            <CommandItem
              v-for="channel in channels"
              :key="channel._id"
              :value="channel.name"
              @select="onChannelClick(channel._id)"
            >
              {{ channel.name }}
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Members">
            <CommandItem
              v-for="member in members"
              :key="member._id"
              :value="member.user.name"
              @select="onMemberClick(member._id)"
            >
              {{ member.user.name }}
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
    <div class="ml-auto flex-1 flex items-center justify-end">
      <Button variant="transparent" size="iconSm">
        <Info class="size-5 text-white" />
      </Button>
    </div>
  </nav>
</template>
