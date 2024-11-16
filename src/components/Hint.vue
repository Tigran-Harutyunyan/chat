<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface HintProps {
  label: string;
  side?: "top" | "right" | "bottom" | "left";
  align?: "start" | "center" | "end";
}

defineProps<HintProps>();
</script>

<template>
  <TooltipProvider>
    <Tooltip :delayDuration="50">
      <TooltipTrigger as-child>
        <slot />
      </TooltipTrigger>
      <TooltipContent
        :side="side"
        :align="align"
        class="bg-black text-white border border-white/5"
      >
        <p class="font-medium text-xs">
          {{ label }}
        </p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
