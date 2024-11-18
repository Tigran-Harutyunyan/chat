<script setup lang="ts">
import { PlusIcon } from "lucide-vue-next";
import { FaCaretDown } from "vue3-icons/fa";
import { useToggle } from "@vueuse/core";

import { cn } from "@/lib/utils";
import Hint from "@/components/Hint.vue";
import { Button } from "@/components/ui/button";

interface WorkspaceSectionProps {
  label: string;
  hint: string;
  allowCreate?: boolean;
}

defineProps<WorkspaceSectionProps>();

type EmitType = {
  (event: "onNew"): void;
};

const emit = defineEmits<EmitType>();

const [value, toggle] = useToggle(false);
</script>

<template>
  <div class="flex flex-col mt-3 px-2">
    <div class="flex items-center px-3.5 group">
      <Button
        variant="transparent"
        class="p-0.5 text-sm text-[#f9edffcc] shrink-0 size-6"
        @click="toggle()"
      >
        <FaCaretDown
          :class="cn('size-4 transition-transform', !value && '-rotate-90')"
        />
      </Button>
      <Button
        variant="transparent"
        size="sm"
        class="group px-1.5 text-sm text-[#f9edffcc] h-[28px] justify-start overflow-hidden items-center"
      >
        <span class="truncate">{{ label }}</span>
      </Button>

      <Hint v-if="allowCreate" :label="hint" side="top" align="center">
        <Button
          @click="emit('onNew')"
          variant="transparent"
          size="iconSm"
          class="opacity-0 group-hover:opacity-100 transition-opacity ml-auto p-0.5 text-sm text-[#f9edffcc] size-6 shrink-0"
        >
          <PlusIcon class="size-5" />
        </Button>
      </Hint>
    </div>
    <template v-if="value">
      <slot />
    </template>
  </div>
</template>
