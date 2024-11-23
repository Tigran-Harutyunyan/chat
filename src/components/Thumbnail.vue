<script setup lang="ts">
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

interface ThumbnailProps {
  url: string | null | undefined;
}
defineProps<ThumbnailProps>();
</script>

<template>
  <Dialog v-if="url">
    <DialogTrigger>
      <div
        class="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in"
      >
        <img
          :src="url"
          alt="Mesage image"
          class="rounded-md object-cover size-full"
        />
      </div>
    </DialogTrigger>
    <DialogContent
      class="max-w-[800px] border-none bg-transparent p-0 shadow-none"
    >
      <img
        :src="url"
        alt="Mesage image"
        class="rounded-md object-cover size-full"
      />
    </DialogContent>
  </Dialog>
</template>
