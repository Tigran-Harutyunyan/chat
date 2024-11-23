<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

interface ThreadBarProps {
  count?: number;
  image?: string;
  timestamp?: number;
  name?: string;
}

const {
  count = 0,
  timestamp = 0,
  image = "",
  name = "",
} = defineProps<ThreadBarProps>();

type EmitType = {
  (event: "click"): void;
};

const emit = defineEmits<EmitType>();
</script>

<template>
  <button
    v-if="count || timestamp"
    @click="emit('click')"
    class="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
  >
    <div class="flex items-center gap-2 overflow-hidden">
      <Avatar class="size-6 shrink-0">
        <AvatarImage :src="image || ''" />
        <AvatarFallback>
          {{ name?.charAt(0).toUpperCase() }}
        </AvatarFallback>
      </Avatar>
      <span class="text-xs text-sky-700 hover:underline font-bold truncate">
        {{ count }} {{ count > 1 ? "replies" : "reply" }}
      </span>
      <span
        class="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block"
      >
        Last reply {{ formatDistanceToNow(timestamp, { addSuffix: true }) }}
      </span>
      <span
        class="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden"
      >
        View thread
      </span>
    </div>
    <ChevronRight
      class="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0"
    />
  </button>
</template>
