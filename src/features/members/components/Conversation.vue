<script setup lang="ts">
import { Loader, TriangleAlert } from "lucide-vue-next";
import Header from "@/features/members/components/Header.vue";
import MessageList from "@/components/MessageList.vue";
import ChatInput from "@/features/members/components/ChatInput.vue";
import { useGetMember } from "@/features/members/api/useGetMember";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { useMemberId } from "@/features/members/hooks/useMemberId";
import { usePanel } from "@/store/usePanel";
import { Id } from "@convex/dataModel";

interface ConversationProps {
  id: Id<"conversations">;
}

const props = defineProps<ConversationProps>();

const { onOpenProfile } = usePanel();
const { memberId } = useMemberId();
const { data: member, isLoading: memberLoading } = useGetMember(memberId.value);
const {
  data: results,
  loadMore,
  isLoadingMore,
  isDone,
} = useGetMessages({
  conversationId: props.id,
});
</script>

<template>
  <div
    v-if="memberLoading"
    class="h-full flex-1 flex items-center justify-center"
  >
    <Loader class="animate-spin size-5 text-muted-foreground" />
  </div>

  <template v-else>
    <div
      v-if="!member"
      class="h-full flex-1 flex flex-col gap-y-2 items-center justify-center"
    >
      <TriangleAlert class="size-5 text-muted-foreground" />
      <span class="text-sm text-muted-foreground"> Channel not found </span>
    </div>
    <div v-else class="flex flex-col h-full">
      <Header
        :memberName="member?.user.name"
        :memberImage="member?.user.image"
        @click="onOpenProfile(memberId)"
      />
      <MessageList
        variant="conversation"
        :member-image="member?.user.image"
        :member-name="member?.user.name"
        :data="results"
        :is-loading-more="isLoadingMore"
        :can-load-more="!isDone"
        @loadMore="loadMore"
      />
      <ChatInput
        :placeholder="`Message # ${member?.user.name}`"
        :conversationId="id"
      />
    </div>
  </template>
</template>
