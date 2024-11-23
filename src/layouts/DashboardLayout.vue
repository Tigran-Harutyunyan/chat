<script setup lang="ts">
import { Loader } from "lucide-vue-next";
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useAuth } from "vue-clerk";
import Modals from "@/components/Modals.vue";
import Thread from "@/features/messages/components/Tread.vue";
import Sidebar from "@/features/workspace/components/Sidebar.vue";
import Toolbar from "@/features/workspace/components/Toolbar.vue";
import WorkspaceSidebar from "@/features/workspace/components/WorkspaceSidebar.vue";
import Profile from "@/features/members/components/Profile.vue";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";

import { usePanel } from "@/store/usePanel";

import { useRouteGuard } from "@/composables/useRouteGuard";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

const { userId, isLoaded } = useAuth();
const isAuthed = isLoaded.value && !!userId.value;

const { workspaceId } = useWorkspaceId();

useRouteGuard(isAuthed);

const { onClose } = usePanel();

const { parentMessageId, profileMemberId } = storeToRefs(usePanel());

const showPanel = computed(
  () => !!parentMessageId.value || !!profileMemberId.value
);
</script>

<template>
  <Modals />
  <div class="h-full">
    <Toolbar :key="workspaceId" />
    <div class="flex h-[calc(100vh-40px)]">
      <Sidebar />
      <ResizablePanelGroup
        direction="horizontal"
        autoSaveId="ca-workspace-layout"
      >
        <ResizablePanel :defaultSize="20" :minSize="11" class="bg-[#5E2C5F]">
          <WorkspaceSidebar :key="workspaceId" />
        </ResizablePanel>
        <ResizableHandle with-handle />
        <ResizablePanel :minSize="20" :defaultSize="80">
          <slot />
        </ResizablePanel>

        <template v-if="showPanel">
          <ResizableHandle with-handle />
          <ResizablePanel :minSize="20" :defaultSize="29">
            <template v-if="parentMessageId">
              <Thread :messageId="parentMessageId" @close="onClose" />
            </template>
            <template v-else>
              <Profile
                v-if="profileMemberId"
                :memberId="profileMemberId"
                @close="onClose"
              />
              <div v-else class="flex h-full items-center justify-center">
                <Loader class="size-5 animate-spin text-muted-foreground" />
              </div>
            </template>
          </ResizablePanel>
        </template>
      </ResizablePanelGroup>
    </div>
  </div>
</template>
