<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Id } from "@convex/dataModel";

const { workspaceId } = useWorkspaceId();

const userItemVariants = cva(
  "flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden",
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

interface UserItemProps {
  id: Id<"members">;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>["variant"];
}

const props = defineProps<UserItemProps>();

const avatarFallback = props.label?.charAt(0).toUpperCase();
</script>

<template>
  <Button
    variant="transparent"
    :class="cn(userItemVariants({ variant: variant }))"
    size="sm"
    asChild
  >
    <RouterLink :to="`/workspace/${workspaceId}/member/${id}`">
      <Avatar class="size-5 rounded-md mr-1">
        <AvatarImage class="rounded-md" :src="image || ''" />
        <AvatarFallback
          class="flex items-center justify-center bg-sky-500 text-white w-full h-full text-sm"
        >
          {{ avatarFallback }}
        </AvatarFallback>
      </Avatar>
      <span class="text-sm truncate">{{ label }}</span>
    </RouterLink>
  </Button>
</template>
