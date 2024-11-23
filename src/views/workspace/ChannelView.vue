<script setup lang="ts">
import ChannelInfo from "@/features/channels/components/ChannelInfo.vue";
import { useChannelId } from "@/features/channels/hooks/useChannelId";

const { channelId } = useChannelId();
</script>

<template>
  <ChannelInfo :channel-id="channelId" :key="channelId" />
</template>
