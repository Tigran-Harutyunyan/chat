<script setup lang="ts">
import { ref } from "vue";
import {
  AlertTriangle,
  HashIcon,
  Loader,
  MessageSquareText,
  SendHorizontal,
} from "lucide-vue-next";

import WorkspaceHeader from "@/features/workspace/components/WorkspaceHeader.vue";
import SidebarItem from "@/features/workspace/components/SidebarItem.vue";
import UserItem from "@/features/workspace/components/UserItem.vue";
import WorkspaceSection from "@/features/workspace/components/WorkspaceSection.vue";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useChannelId } from "@/features/channels/hooks/useChannelId";
import { useGetWorkspace } from "@/features/workspace/api/useGetWorkspace";
import { useGetChannels } from "@/features/workspace/api/useGetChannels";
import { useGetMembers } from "@/features/workspace/api/useGetMembers";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useClerkUser } from "@/composables/useClerkUser";
import { useRouter } from "vue-router";
import { useCreateChannelModal } from "@/features/channels/store/useCreateChannelModal";

const { workspaceId } = useWorkspaceId();
const { channelId } = useChannelId();
const router = useRouter();
const { email } = useClerkUser();
const ADMIN_ROLE = "admin";

const { onOpen } = useCreateChannelModal();

const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
  id: workspaceId.value,
  email,
});

const { data: member, isLoading: memberLoading } = useCurrentMember(
  workspaceId.value
);

const { data: channels } = useGetChannels(workspaceId.value);
const { data: members } = useGetMembers(workspaceId.value);
</script>

<template>
  <div
    v-if="workspaceLoading || memberLoading"
    class="flex flex-col bg-[#5E2C5F] h-full items-center justify-center"
  >
    <Loader class="size-5 animate-spin text-white" />
  </div>

  <div
    v-if="(!workspace || !member) && !workspaceLoading && !memberLoading"
    class="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center"
  >
    <AlertTriangle class="size-5 text-white" />
    <p class="text-white text-sm">Workspace not found</p>
  </div>

  <div v-if="member" class="flex flex-col bg-[#5E2C5F] h-full">
    <WorkspaceHeader
      :workspace="workspace"
      :isAdmin="member?.role === ADMIN_ROLE"
    />
    <div class="flex flex-col px-2 mt-3">
      <SidebarItem label="Threads" id="threads">
        <component :is="MessageSquareText" />
      </SidebarItem>
      <SidebarItem label="Drafts & Sent" id="drafts">
        <component :is="SendHorizontal" />
      </SidebarItem>
    </div>
    <WorkspaceSection
      label="Channels"
      hint="New channel"
      :allowCreate="member?.role === ADMIN_ROLE"
      @onNew="onOpen()"
    >
      <SidebarItem
        v-for="item in channels"
        :label="item.name"
        :key="item._id"
        :id="item._id"
        :variant="channelId === item._id ? 'active' : 'default'"
      >
        <component :is="HashIcon" />
      </SidebarItem>
    </WorkspaceSection>
    <WorkspaceSection label="Direct Messages" hint="New direct message">
      <UserItem
        v-for="item in members"
        :key="item._id"
        :id="item._id"
        :label="item.user.name"
        :image="item.user.image"
        :variant="item._id === memberId ? 'active' : 'default'"
      />
    </WorkspaceSection>
  </div>
</template>
