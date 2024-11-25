<script setup lang="ts">
import { ref, computed, useTemplateRef } from "vue";
import MdOutlineAddReaction from "@/components/icons/MdOutlineAddReaction.vue";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import Hint from "@/components/Hint.vue";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useCurrentMember } from "@/features/members/api/useCurrentMember";

import { Doc, Id } from "@convex/dataModel";

// Emoji picker

import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";

import { onClickOutside } from "@vueuse/core";

const targetRef = useTemplateRef("pop-over");

onClickOutside(targetRef, (event) => (isOpen.value = false));

const emojiIndex = ref();

import(`emoji-mart-vue-fast/data/all.json`).then((module) => {
  emojiIndex.value = new EmojiIndex(module.default);
});

interface ReactionsProps {
  data: Array<
    Omit<Doc<"reactions">, "memberId"> & {
      count: number;
      memberIds: Id<"members">[];
    }
  >;
}

const props = defineProps<ReactionsProps>();

const { workspaceId } = useWorkspaceId();
const { data: currentMember } = useCurrentMember(workspaceId.value);

const currentMemberId = computed(() => currentMember?._id);

type EmitType = {
  (event: "change", value: string): void;
};

const emit = defineEmits<EmitType>();

const isOpen = ref(false);

const onSelectEmoji = (emoji) => {
  emit("change", emoji.native);
  isOpen.value = false;
};
</script>

<template>
  <div
    v-if="props.data.length > 0 || currentMemberId"
    class="flex items-center gap-1 mt-1 mb-1"
  >
    <Hint
      v-for="reaction in props.data"
      :key="reaction._id"
      :label="`${reaction.count} ${reaction.count === 1 ? 'person' : 'people'} reacted with ${reaction.value}`"
    >
      <button
        @click="emit('change', reaction.value)"
        :class="
          cn(
            'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1',
            reaction.memberIds.includes(currentMemberId) &&
              'bg-blue-100/70 border-blue-500 text-white'
          )
        "
      >
        {{ reaction.value }}
        <span
          :class="
            cn(
              'text-xs font-semibold text-muted-foreground',
              reaction.memberIds.includes(currentMemberId) && 'text-blue-500'
            )
          "
          >{{ reaction.count }}</span
        >
      </button>
    </Hint>

    <Popover :open="isOpen" @update-open="isOpen = !isOpen">
      <PopoverTrigger as-child>
        <button
          @click="isOpen = !isOpen"
          class="h-7 px-3 rounded-full bg-slate-200/70 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1"
        >
          <MdOutlineAddReaction class="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent class="w-[340px] p-0">
        <Picker
          ref="pop-over"
          :data="emojiIndex"
          :show-preview="false"
          @select="onSelectEmoji"
        />
      </PopoverContent>
    </Popover>
  </div>
</template>
