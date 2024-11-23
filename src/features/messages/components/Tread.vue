<script setup lang="ts">
import { toast } from "vue-sonner";

import {
  defineAsyncComponent,
  computed,
  ref,
  onMounted,
  onUnmounted,
  useTemplateRef,
} from "vue";
import { AlertTriangle, Loader, XIcon } from "lucide-vue-next";
import { differenceInMinutes, format, isToday, isYesterday } from "date-fns";
import { useGetMessage } from "@/features/messages/api/useGetMessage";
import { useGetMessages } from "@/features/messages/api/useGetMessages";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";

import { Button } from "@/components/ui/button";
import Message from "@/components/Message.vue";

import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useChannelId } from "@/features/channels/hooks/useChannelId";
import { useClerkUser } from "@/composables/useClerkUser";

import { Id } from "@convex/dataModel";

const Editor = defineAsyncComponent(() => import("@/components/Editor.vue"));

const TIME_THRESHOLD = 5;

interface ThreadProps {
  messageId: Id<"messages">;
}

const props = defineProps<ThreadProps>();

type EmitType = {
  (event: "close"): void;
};

const emit = defineEmits<EmitType>();

type CreateMesageValues = {
  channelId: Id<"channels">;
  workspaceId: Id<"workspaces">;
  parentMessageId: Id<"messages">;
  body: string;
  image: Id<"_storage"> | undefined;
};

const editorKey = ref(0);
const editingId = ref<Id<"messages"> | null>(null);
const isPending = ref(false);
const target = useTemplateRef("target");
const { email } = useClerkUser();

let observer = null;

const { channelId } = useChannelId();
const { workspaceId } = useWorkspaceId();
const { data: currentMember } = useCurrentMember(workspaceId.value);

const { mutate: generateUploadUrl } = useGenerateUploadUrl();
const { mutate: createMessage } = useCreateMessage();

const {
  data: results,
  loadMore,
  isLoading: isInitialMessagesLoading,
  isLoadingMore,
  isDone,
} = useGetMessages({
  channelId: channelId.value,
  parentMessageId: props.messageId,
});

const { data: message, isLoading: loadingMessage } = useGetMessage(
  props.messageId
);

const groupedMessages = computed(() => {
  if (!results?.value) return {};
  return results?.value?.reduce(
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
    {} as Record<string, typeof data>
  );
});

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return "Today";
  if (isYesterday(date)) return "Yesterday";
  return format(date, "EEEE, MMMM d");
};

const handleSubmit = async ({
  body,
  image,
}: {
  body: string;
  image: File | null;
}) => {
  try {
    isPending.value = true;

    const values: CreateMesageValues = {
      channelId: channelId.value,
      workspaceId: workspaceId.value,
      parentMessageId: props.messageId,
      body,
      image: undefined,
      email,
    };

    if (image) {
      const url = await generateUploadUrl({});

      if (!url) {
        throw new Error("Url not found");
      }

      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();
      values.image = storageId;
    }

    await createMessage(values);

    editorKey.value = editorKey.value + 1;
  } catch (error) {
    toast.error("Failed to send message");
  } finally {
    isPending.value = false;
  }
};
onMounted(() => {
  if (target.value) {
    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isDone) {
          loadMore();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(target.value);
  }
});

onUnmounted(() => {
  observer?.disconnect();
});
</script>

<template>
  <div
    v-if="loadingMessage || isInitialMessagesLoading"
    class="h-full flex flex-col"
  >
    <div class="h-[49px] flex justify-between items-center px-4 border-b">
      <p class="text-lg font-bold">Thread</p>
      <Button @click="emit('close')" size="iconSm" variant="ghost">
        <XIcon class="size-5 stroke-[1.5]" />
      </Button>
    </div>
    <div class="flex flex-col gap-y-2 h-full items-center justify-center">
      <Loader class="size-5 animate-spin text-muted-foreground" />
    </div>
  </div>
  <template v-else>
    <div v-if="!message && !loadingMessage" class="h-full flex flex-col">
      <div class="h-[49px] flex justify-between items-center px-4 border-b">
        <p class="text-lg font-bold">Thread</p>
        <Button @click="emit('close')" size="iconSm" variant="ghost">
          <XIcon class="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div class="flex flex-col gap-y-2 h-full items-center justify-center">
        <AlertTriangle class="size-5 text-muted-foreground" />
        <p class="text-sm text-muted-foreground">Message not found</p>
      </div>
    </div>
    <div v-else class="h-full flex flex-col sex">
      <div class="h-[49px] flex justify-between items-center px-4 border-b">
        <p class="text-lg font-bold">Thread</p>
        <Button @click="emit('close')" size="iconSm" variant="ghost">
          <XIcon class="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div
        class="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar"
      >
        <div class="h-1" ref="target" />
        <div
          v-for="[dateKey, messages] in Object.entries(groupedMessages)"
          :key="dateKey"
        >
          <div class="text-center my-2 relative">
            <hr
              class="absolute top-1/2 left-0 right-0 border-t border-gray-300"
            />
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
            hide-thread-button
            :thread-count="message.threadCount"
            :thread-image="message.threadImage"
            :thread-name="message.threadName"
            :thread-timestamp="message.threadTimestamp"
            @setEditingId="(messageId) => (editingId = messageId)"
          />
        </div>

        <div v-if="isLoadingMore" class="text-center my-2 relative">
          <hr
            class="absolute top-1/2 left-0 right-0 border-t border-gray-300"
          />
          <span
            class="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm"
          >
            <Loader class="size-4 animate-spin" />
          </span>
        </div>

        <Message
          hideThreadButton
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
          @setEditingId="(messageId) => (editingId = messageId)"
        />
      </div>
      <div class="px-4">
        <Editor
          :key="editorKey"
          placeholder="Reply.."
          :disabled="isPending"
          @submit="handleSubmit"
        />
      </div>
    </div>
  </template>
</template>
