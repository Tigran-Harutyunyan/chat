<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, defineAsyncComponent, useTemplateRef } from "vue";
import { format, isToday, isYesterday } from "date-fns";
import { useUpdateMessage } from "@/features/messages/api/useUpdateMessage";
import { useRemoveMessage } from "@/features/messages/api/useRemoveMessage";
import { useToggleReaction } from "@/features/reactions/api/useToggleReaction";
import { useClerkUser } from "@/composables/useClerkUser";

import { cn } from "@/lib/utils";
import { usePanel } from "@/store/usePanel";
import { Doc, Id } from "@convex/dataModel";
import ConfirmDialog from "@/components/ConfirmDialog.vue";
import Hint from "@/components/Hint.vue";
import Renderer from "@/components/Renderer.vue";
import Toolbar from "@/components/Toolbar.vue";
import Thumbnail from "@/components/Thumbnail.vue";
import Reactions from "@/components/Reactions.vue";
import ThreadBar from "@/components/ThreadBar.vue";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const Editor = defineAsyncComponent(() => import("@/components/Editor.vue"));

interface MessageProps {
  id: Id<"messages">;
  memberId: Id<"members">;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
  body: Doc<"messages">["body"];
  image: string | null | undefined;
  createdAt: Doc<"messages">["_creationTime"];
  updatedAt: Doc<"messages">["updatedAt"];
  isEditing: boolean;
  isCompact?: boolean;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
}

type EmitType = {
  (event: "setEditingId", value: Id<"messages"> | null): void;
};

const emit = defineEmits<EmitType>();
const props = defineProps<MessageProps>();

const formatFullTime = (date: Date) => {
  return `${isToday(date) ? "Today" : isYesterday(date) ? "Yesterday" : format(date, "MMM d, yyyy")} at ${format(date, "h:mm:ss a")}`;
};

const confirm = useTemplateRef<InstanceType<typeof ConfirmDialog> | null>(
  "confirm-dialog"
);

const { onClose, onOpenMessage, onOpenProfile } = usePanel();

const { parentMessageId } = storeToRefs(usePanel());

const { email } = useClerkUser();

const { mutate: updateMessage, isLoading: isUpdatingMessage } =
  useUpdateMessage();
const { mutate: removeMessage, isLoading: isRemovingMessage } =
  useRemoveMessage();
const { mutate: toggleReaction, isLoading: isTogglingReaction } =
  useToggleReaction();

const isPending = computed(
  () => isUpdatingMessage.value || isTogglingReaction.value
);

const avatarFallback = props.authorName?.charAt(0).toUpperCase();

const handleReaction = (emoji: string) => {
  toggleReaction({ messageId: props.id, value: emoji, email });
};

const handleRemove = async () => {
  const ok = await confirm.value?.openModal(
    "Delete message",
    "Are you sure you want to delete this message? This cannot be undone."
  );

  if (!ok) return;

  try {
    const id = await removeMessage({
      id: props.id,
      email,
    });

    if (id) {
      emit("setEditingId", null);
      if (parentMessageId.value === id) {
        onClose();
      }
    }
  } catch (error) {}
};

const handleUpdate = async ({ body }: { body: string }) => {
  try {
    const id = await updateMessage({
      id: props.id,
      body,
      email,
    });

    if (id) {
      emit("setEditingId", null);
    }
  } catch (error) {}
};
</script>

<template>
  <ConfirmDialog ref="confirm-dialog" />
  <div
    :class="
      cn(
        'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
        isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
        isRemovingMessage &&
          'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
      )
    "
  >
    <div class="flex items-start gap-2">
      <button @click="onOpenProfile(memberId)">
        <Avatar>
          <AvatarImage :src="authorImage || ''" />
          <AvatarFallback>
            {{ avatarFallback }}
          </AvatarFallback>
        </Avatar>
      </button>

      <div v-if="isEditing" class="w-full h-full">
        <Editor
          variant="update"
          :disabled="isPending"
          :defaultValue="JSON.parse(body)"
          @cancel="emit('setEditingId', null)"
          @submit="handleUpdate"
        >
        </Editor>
      </div>

      <div v-else class="flex flex-col w-full overflow-hidden">
        <div class="text-sm">
          <button
            @click="() => onOpenProfile(memberId)"
            class="font-bold text-primary hover:underline"
          >
            {{ authorName }}
          </button>
          <span>&nbsp;&nbsp;</span>
          <Hint :label="formatFullTime(new Date(createdAt))">
            <button class="text-xs text-muted-foreground hover:underline">
              {{ format(new Date(createdAt), "h:mm a") }}
            </button>
          </Hint>
        </div>
        <Renderer :value="body" />
        <Thumbnail :url="image" />
        <span v-if="updatedAt" class="text-xs text-muted-foreground"
          >(edited)</span
        >
        <Reactions :data="reactions" @change="handleReaction" />
        <ThreadBar
          :count="threadCount"
          :image="threadImage"
          :name="threadName"
          :timestamp="threadTimestamp"
          @click="onOpenMessage(id)"
        />
      </div>
    </div>

    <Toolbar
      v-if="!isEditing"
      :isAuthor="isAuthor"
      :isPending="isPending"
      :hideThreadButton="hideThreadButton"
      @edit="emit('setEditingId', id)"
      @thread="onOpenMessage(id)"
      @delete="handleRemove"
      @reaction:select="handleReaction"
    />
  </div>
</template>
