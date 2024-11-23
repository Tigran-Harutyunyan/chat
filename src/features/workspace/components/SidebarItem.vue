<script setup lang="ts">
import { LucideIcon } from "lucide-vue-next";
import { IconType } from "vue3-icons/lib";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";

const { workspaceId } = useWorkspaceId();

const sidebarItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden",
  {
    variants: {
      variant: {
        default: "text-[#f9edffcc]",
        active: "text-[#481349] bg-white/90 hover:bg-white/90",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface SidebarItemProps {
  label: string;
  id: string;
  variant?: VariantProps<typeof sidebarItemVariants>["variant"];
  linked?: boolean;
}

withDefaults(defineProps<SidebarItemProps>(), {
  linked: true,
});
</script>

<template>
  <Button
    variant="transparent"
    size="sm"
    :class="cn(sidebarItemVariants({ variant }))"
    as-child
  >
    <RouterLink v-if="linked" :to="`/workspace/${workspaceId}/channel/${id}`">
      <div class="flex items-center">
        <div class="sidebar-item-icon-wrapper">
          <slot />
        </div>
        <span class="text-sm truncate">{{ label }}</span>
      </div>
    </RouterLink>

    <div v-else class="flex items-center">
      <div class="sidebar-item-icon-wrapper">
        <slot />
      </div>
      <span class="text-sm truncate">{{ label }}</span>
    </div>
  </Button>
</template>
