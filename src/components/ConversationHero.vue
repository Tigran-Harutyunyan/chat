<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ConversationHeroProps {
  name?: string;
  image?: string;
}

const { image = "", name = "" } = defineProps<ConversationHeroProps>();

const avatarFallback = name?.charAt(0).toUpperCase();
</script>

<template>
  <div class="mt-[88px] mx-5 mb-4">
    <div class="flex items-center gap-x-1 mb-2">
      <Avatar class="size-12 mr-2 rounded-md">
        <AvatarImage :src="image" />
        <AvatarFallback class="aspect-square">{{
          avatarFallback
        }}</AvatarFallback>
      </Avatar>
      <p class="text-2xl font-bold">
        {{ name }}
      </p>
    </div>
    <p class="font-normal text-slate-800 mb-4">
      This conversation is just between you and <strong>{{ name }}</strong>
    </p>
  </div>
</template>
