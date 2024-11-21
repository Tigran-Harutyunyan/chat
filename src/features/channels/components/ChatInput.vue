<script setup lang="ts">
import { toast } from "vue-sonner";
import { ref } from "vue";
import { Id } from "../../../../convex/_generated/dataModel";
//const Editor = defineAsyncComponent(() => import("@/components/Editor.vue"));
import Editor from "@/components/Editor.vue";
import { useGenerateUploadUrl } from "@/features/upload/api/useGenerateUploadUrl";
import { useCreateMessage } from "@/features/messages/api/useCreateMessage";
import { useChannelId } from "@/features/channels/hooks/useChannelId";
import { useWorkspaceId } from "@/features/workspace/hooks/useWorkspaceId";
import { useClerkUser } from "@/composables/useClerkUser";

interface ChatInputProps {
  placeholder: string;
  conversationId?: Id<"conversations">;
}

type CreateMesageValues = {
  conversationId: Id<"conversations">;
  workspaceId: Id<"workspaces">;
  body: string;
  image: Id<"_storage"> | undefined;
  channelId?: Id<"channels">;
  parentMessageId?: I<"messages">;
};

const props = defineProps<ChatInputProps>();

const editorKey = ref(0);
const isPending = ref(false);
const { mutate: generateUploadUrl } = useGenerateUploadUrl();
const { mutate: createMessage } = useCreateMessage();
const { channelId } = useChannelId();
const { workspaceId } = useWorkspaceId();
const { email } = useClerkUser();

const handleSubmit = async ({
  body,
  image,
}: {
  body: string;
  image: File | null;
}) => {
  try {
    isPending.value = true;

    const values: CreateMesageValues = {
      conversationId: props.conversationId,
      workspaceId: workspaceId.value,
      channelId: channelId.value,
      body,
      image: undefined,
      email,
    };

    if (image) {
      const url = await generateUploadUrl({}, { throwError: true });

      if (!url) {
        throw new Error("Url not found");
      }

      const result = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": image.type },
        body: image,
      });

      if (!result.ok) {
        throw new Error("Failed to upload image");
      }

      const { storageId } = await result.json();
      values.image = storageId;
    }

    await createMessage(values, { throwError: true });

    editorKey.value = editorKey.value + 1;
  } catch (error) {
    toast.error("Failed to send message");
  } finally {
    isPending.value = false;
  }
};
</script>

<template>
  <div class="px-5 w-full flex">
    <Editor
      :key="editorKey"
      :placeholder="placeholder"
      :disabled="isPending"
      @submit="handleSubmit"
    />
  </div>
</template>
