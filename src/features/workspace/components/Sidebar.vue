<script setup lang="ts">
import { Bell, Home, MessagesSquare, MoreHorizontal } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { SignedIn } from "vue-clerk";
import UserButton from "@/features/auth/components/UserButton.vue";
import SidebarButton from "@/features/workspace/components/SidebarButton.vue";
import WorkspaceSwitcher from "@/features/workspace/components//WorkspaceSwitcher.vue";

const pathname = useRoute().path;
</script>

<template>
  <aside
    class="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[9px] pb-4"
  >
    <WorkspaceSwitcher />
    <SidebarButton label="Home" :isActive="pathname.includes('/workspace')">
      <component :is="Home" />
    </SidebarButton>
    <SidebarButton label="DMs">
      <component :is="MessagesSquare" />
    </SidebarButton>
    <SidebarButton label="Activity">
      <component :is="Bell" />
    </SidebarButton>
    <SidebarButton label="More">
      <component :is="MoreHorizontal" />
    </SidebarButton>
    <div class="flex flex-col items-center justify-center gap-y-1 mt-auto">
      <SignedIn>
        <UserButton />
      </SignedIn>
    </div>
  </aside>
</template>
