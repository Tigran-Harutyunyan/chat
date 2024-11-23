<script setup lang="ts">
import DashboardLayout from "@/layouts/DashboardLayout.vue";
import ChannelInfo from "@/features/channels/components/ChannelInfo.vue";
import { useChannelId } from "@/features/channels/hooks/useChannelId";
import { useGetChannel } from "@/features/channels/api/useGetChannel";

const { channelId } = useChannelId();
</script>

<template>
  <DashboardLayout>
    <ChannelInfo :channel-id="channelId" :key="channelId" />
  </DashboardLayout>
</template>
