<script setup lang="ts">
import { Loader, TriangleAlert } from "lucide-vue-next";
import Header from "@/features/channels/components/Header.vue";
import MessageList from "@/components/MessageList.vue";
import ChatInput from "@/features/channels/components/ChatInput.vue";
import { useChannelId } from "@/features/channels/hooks/useChannelId";
import { useGetChannel } from "@/features/channels/api/useGetChannel";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { Id } from "@convex/dataModel";

const { channelId } = useChannelId();
const {
  data: results,
  loadMore,
  isLoading: isInitialMessagesLoading,
  isLoadingMore,
  isDone,
} = useGetMessages({
  channelId: channelId.value,
});

interface Props {
  channelId: Id<"channels">;
}

const props = defineProps<Props>();

const { data: channel, isLoading: channelLoading } = useGetChannel(
  props.channelId
);
</script>

<template>
  <div
    v-if="channelLoading || isInitialMessagesLoading"
    class="h-full flex-1 flex items-center justify-center"
  >
    <Loader class="animate-spin size-5 text-muted-foreground" />
  </div>

  <template v-else>
    <div
      v-if="!channel"
      class="h-full flex-1 flex flex-col gap-y-2 items-center justify-center"
    >
      <TriangleAlert class="size-5 text-muted-foreground" />
      <span class="text-sm text-muted-foreground"> Channel not found </span>
    </div>
    <div v-else class="flex flex-col h-full">
      <Header :title="channel.name" :key="channelId" />
      <MessageList
        :channel-name="channel.name"
        :channel-creation-time="channel._creationTime"
        :data="results"
        :is-loading-more="isLoadingMore"
        :can-load-more="!isDone"
        @loadMore="loadMore"
      />
      <ChatInput :placeholder="`Message # ${channel.name}`" />
    </div>
  </template>
</template>
