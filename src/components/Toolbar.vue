<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import { MessageSquareTextIcon, Pencil, Smile, Trash } from "lucide-vue-next";
import Hint from "@/components/Hint.vue";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../components/ui/popover";
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import { onClickOutside } from "@vueuse/core";

type EmitType = {
  (event: "edit"): void;
  (event: "thread"): void;
  (event: "delete"): void;
  (event: "reaction:select", value: string): void;
};

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  hideThreadButton?: boolean;
}

const {
  hideThreadButton = false,
  isPending = false,
  isAuthor = false,
} = defineProps<ToolbarProps>();

const emit = defineEmits<EmitType>();

let emojiIndex = new EmojiIndex(data);

const isOpen = ref(false);

const targetRef = useTemplateRef("pop-over");

onClickOutside(targetRef, (event) => (isOpen.value = false));

const onSelectEmoji = (emoji) => {
  emit("reaction:select", emoji.native);
  isOpen.value = false;
};
</script>

<template>
  <div class="absolute top-0 right-5">
    <div
      class="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm relative"
    >
      <Popover :open="isOpen" @update-open="isOpen = !isOpen">
        <PopoverTrigger as-child>
          <Button
            :disabled="isPending"
            size="iconSm"
            variant="ghost"
            @click="isOpen = !isOpen"
          >
            <Smile class="size-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent class="w-[340px] p-0">
          <Picker
            v-if="isOpen"
            ref="pop-over"
            :data="emojiIndex"
            :show-preview="false"
            @select="onSelectEmoji"
          />
        </PopoverContent>
      </Popover>

      <Hint v-if="!hideThreadButton" label="Reply in thread">
        <Button
          variant="ghost"
          size="iconSm"
          :disabled="isPending"
          @click="emit('thread')"
        >
          <MessageSquareTextIcon class="size-4" />
        </Button>
      </Hint>

      <Hint v-if="isAuthor" label="Edit message">
        <Button
          variant="ghost"
          size="iconSm"
          :disabled="isPending"
          @click="emit('edit')"
        >
          <Pencil class="size-4" />
        </Button>
      </Hint>

      <Hint v-if="isAuthor" label="Delete message">
        <Button
          variant="ghost"
          size="iconSm"
          :disabled="isPending"
          @click="emit('delete')"
        >
          <Trash class="size-4" />
        </Button>
      </Hint>
    </div>
  </div>
</template>
