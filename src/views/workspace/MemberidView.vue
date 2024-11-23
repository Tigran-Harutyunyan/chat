<script setup lang="ts">
import { ref, watchEffect } from "vue";
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import { AlertTriangle, Loader } from "lucide-vue-next";
import { Id } from "@convex/dataModel";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useMemberId } from "@/features/members/hooks/useMemberId";
import { useCreateOrGetConversation } from "@/features/conversations/api/useCreateOrGetConversation";
import Conversation from "@/features/members/components/Conversation.vue";
import { useClerkUser } from "@/composables/useClerkUser";

const { email } = useClerkUser();
const { memberId } = useMemberId();
const { workspaceId } = useWorkspaceId();
const conversationId = ref<Id<"conversations"> | null>(null);

const { mutate, isLoading } = useCreateOrGetConversation((id) => {
  conversationId.value = id;
});

watchEffect(() => {
  mutate({
    workspaceId: workspaceId.value,
    memberId: memberId.value,
    email,
  });
});
</script>

<template>
  <DashboardLayout>
    <div v-if="isLoading" class="h-full flex items-center justify-center">
      <Loader class="size-6 animate-spin text-muted-foreground" />
    </div>
    <template v-else>
      <div
        v-if="!conversationId"
        class="h-full flex flex-col gap-y-2 items-center justify-center"
      >
        <AlertTriangle class="size-6 text-muted-foreground" />
        <span class="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
      <Conversation v-else :id="conversationId" />
    </template>
  </DashboardLayout>
</template>
