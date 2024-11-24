<script setup lang="ts">
import {
  ref,
  computed,
  useTemplateRef,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
} from "vue";
import { Loader } from "lucide-vue-next";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { Id } from "@convex/dataModel";

import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { GetMessagesReturnType } from "@/features/messages/api/useGetMessages";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

import Message from "@/components/Message.vue";
import ChannelHero from "@/components/ChannelHero.vue";
import ConversationHero from "@/components/ConversationHero.vue";
import { useScroll } from "@vueuse/core";
import { useUi } from "@/store/useUi";
import { storeToRefs } from "pinia";

const target = useTemplateRef("target");

const TIME_THRESHOLD = 5;

interface MessageListProps {
  memberName?: string;
  memberImage?: string;
  channelName?: string;
  channelCreationTime?: number;
  variant?: "channel" | "thread" | "conversation";
  data: GetMessagesReturnType | undefined;
  isLoadingMore: boolean;
  canLoadMore: boolean;
}

type EmitType = {
  (event: "loadMore"): void;
};

const props = defineProps<MessageListProps>();

const emit = defineEmits<EmitType>();

const { newMessageId } = storeToRefs(useUi());

const editingId = ref<Id<"messages"> | null>(null);
const { workspaceId } = useWorkspaceId();

const { data: currentMember } = useCurrentMember(workspaceId.value);

const groupedMessages = computed(() => {
  if (!props.data) return {};
  return props.data?.reduce(
    (groups, message, index, arr) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, "yyyy-MM-dd");
      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }

      const prevMessage = arr[index - 1];
      const isCompact =
        prevMessage &&
        prevMessage.user?._id === message.user?._id &&
        differenceInMinutes(
          new Date(message._creationTime),
          new Date(prevMessage._creationTime)
        ) < TIME_THRESHOLD;

      message.isCompact = isCompact;

      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof props.data>
  );
});

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

const messageListRef = ref<HTMLElement | null>(null);
const { y } = useScroll(messageListRef);

const scrollIt = async () => {
  // scroll on create new message.
  if (messageListRef.value?.scrollHeight && props.data?.length) {
    await nextTick();
    y.value = messageListRef.value.scrollHeight;
  }
};

const observer = ref<IntersectionObserver | null>(null);

onMounted(() => {
  if (target.value) {
    observer.value = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && props.canLoadMore) {
          emit("loadMore");
        }
      },
      { threshold: 1.0 }
    );

    observer.value.observe(target.value);
  }
});

onUnmounted(() => {
  observer.value?.disconnect();
});

watch(
  () => newMessageId.value,
  (newVal, oldVal) => {
    if (newVal !== oldVal) scrollIt();
  }
);
</script>

<template>
  <div
    ref="messageListRef"
    class="flex-1 flex flex-col-reverse pb-4 overflow-y-auto"
  >
    <div class="h-[1px]" ref="target" />
    <div
      v-for="[dateKey, messages] in Object.entries(groupedMessages)"
      :key="dateKey"
    >
      <div class="text-center my-2 relative">
        <hr class="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
        <span
          class="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
        >
          {{ formatDateLabel(dateKey) }}
        </span>
      </div>

      <Message
        v-for="message in messages"
        :key="message._id"
        :id="message._id"
        :member-id="message.memberId"
        :author-image="message.user.image"
        :author-name="message.user.name"
        :is-author="message.memberId === currentMember?._id"
        :reactions="message.reactions"
        :body="message.body"
        :image="message.image"
        :updated-at="message.updatedAt"
        :created-at="message._creationTime"
        :is-editing="editingId === message._id"
        :is-compact="message.isCompact"
        :hide-thread-button="variant === 'thread'"
        :thread-count="message.threadCount"
        :thread-image="message.threadImage"
        :thread-name="message.threadName"
        :thread-timestamp="message.threadTimestamp"
        @setEditingId="(messageId) => (editingId = messageId)"
      />
    </div>

    <div v-if="isLoadingMore" class="text-center my-2 relative">
      <hr class="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
      <span
        class="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
      >
        <Loader class="size-4 animate-spin" />
      </span>
    </div>
    <ChannelHero
      v-if="variant === 'channel' && channelName && channelCreationTime"
      :name="channelName"
      :creationTime="channelCreationTime"
    />
    <ConversationHero
      v-if="variant === 'conversation'"
      :name="memberName"
      :image="memberImage"
    />
  </div>
</template>
