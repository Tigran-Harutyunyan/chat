<script setup lang="ts">
import { FaChevronDown } from "vue3-icons/fa";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
}

defineProps<HeaderProps>();

type EmitType = {
  (event: "click"): void;
};

const emit = defineEmits<EmitType>();
</script>

<template>
  <div
    class="bg-white border-b h-[49px] flex items-center px-4 overflow-hidden"
  >
    <Button
      variant="ghost"
      class="text-lg font-semibold px-2 overflow-hidden w-auto"
      size="sm"
      @click="emit('click')"
    >
      <Avatar class="size-6 mr-2">
        <AvatarImage :src="memberImage || ''" />
        <AvatarFallback>
          {{ memberName?.charAt(0).toUpperCase() }}
        </AvatarFallback>
      </Avatar>
      <span class="truncate">{{ memberName }}</span>
      <FaChevronDown class="size-2.5 ml-2" />
    </Button>
  </div>
</template>
