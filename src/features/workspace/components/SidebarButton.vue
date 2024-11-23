<script setup lang="ts">
import { LucideIcon } from "lucide-vue-next";
import { IconType } from "vue3-icons/lib";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SidebarButtonProps {
  label: string;
  isActive?: boolean;
}

defineProps<SidebarButtonProps>();
</script>

<template>
  <div
    class="flex flex-col items-center jusify-center gap-y-0.5 cursor-pointer group"
  >
    <Button
      variant="transparent"
      :class="
        cn('size-9 p-2 group-hover:bg-accent/20', isActive && 'bg-accent/20')
      "
    >
      <span
        class="size-5 text-white group-hover:scale-110 transition-all flex items-center justify-center"
      >
        <slot />
      </span>
    </Button>
    <span class="text-[11px] text-white group-hover:text-accent">
      {{ label }}
    </span>
  </div>
</template>
