<script setup lang="ts">
import { computed } from "vue";
import { useConvexQuery } from "@convex-vue/core";
import { api } from "../../../../convex/_generated/api";

import { Loader, LogOut } from "lucide-vue-next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUser, SignOutButton } from "vue-clerk";

const { isLoaded, isSignedIn, user } = useUser();

// const { data, isLoading } = useConvexQuery(api.users.current, {
//   email: user.value.emailAddresses,
// });

const avatarFallback = computed(() => {
  return user.value && user.value.firstName
    ? user.value.firstName!.charAt(0).toUpperCase()
    : "";
});
</script>

<template>
  <DropdownMenu :modal="false">
    <DropdownMenuTrigger class="outline-none relative">
      <Avatar class="rounded-md size-10 hover:opacity-75 transition">
        <!-- <AvatarImage class="rounded-md" :alt="name" :src="image" /> -->
        <AvatarFallback
          class="flex items-center justify-center bg-sky-500 text-white w-full h-full"
        >
          {{ avatarFallback }}
        </AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>

    <DropdownMenuContent align="center" side="right" class="w-60">
      <DropdownMenuItem class="h-10">
        <SignOutButton v-slot="props">
          <span class="flex items-center"
            ><LogOut class="size-4 mr-2" /> Log out</span
          >
        </SignOutButton>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
