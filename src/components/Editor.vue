<script setup lang="ts">
import { ref, reactive, computed, watch, useTemplateRef } from "vue";
import { quillEditor } from "vue3-quill";
import { PiTextAa } from "vue3-icons/pi";
import { ImageIcon, Smile, XIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";
import { onClickOutside } from "@vueuse/core";
import MdSend from "@/components/icons/MdSend.vue";
import Hint from "@/components/Hint.vue";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Emoji picker
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";

type EditorValue = {
  image: File | null;
  body: string;
};

type EmitType = {
  (event: "submit", value: EditorValue): void;
  (event: "cancel"): void;
};

interface EditorProps {
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  variant?: "create" | "update";
}

const props = withDefaults(defineProps<EditorProps>(), {
  placeholder: "Write something...",
  defaultValue: [],
  disabled: false,
  variant: "create",
});

const emit = defineEmits<EmitType>();
const isOpen = ref(false);

let quill: any;

const text = ref("");
const image = ref<File | null>(null);
const imageSrc = ref("");
const isToolbarVisible = ref(true);
const submitRef = ref();
const imageElementRef = ref<HTMLInputElement | null>(null);

const targetRef = useTemplateRef("pop-over");
const editorRef = useTemplateRef("editor");

onClickOutside(targetRef, () => (isOpen.value = false));

const emojiIndex = ref();

import(`emoji-mart-vue-fast/data/all.json`).then((module) => {
  emojiIndex.value = new EmojiIndex(module.default);
});

const isEmpty = computed(
  () =>
    !image.value && text.value.replace(/<(.|\n)*?>/g, "").trim().length === 0
);

const state = reactive({
  content: "",
  _content: "",
  editorOption: {
    placeholder: props.placeholder,
    theme: "snow",
    modules: {
      toolbar: [
        ["bold", "italic", "strike"],
        ["link"],
        [{ list: "ordered" }, { list: "bullet" }],
      ],
      keyboard: {
        bindings: {
          enter: {
            key: "Enter",
            handler: () => {
              const text = quill?.getText();
              const addedImage = imageElementRef.value?.files?.[0] || null;

              const isEmpty =
                !addedImage &&
                text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

              if (isEmpty) return;

              const body = JSON.stringify(quill?.getContents());
              submitRef.value = { body, image: addedImage };
              submit();
            },
          },
          shift_enter: {
            key: "Enter",
            shiftKey: true,
            handler: () => {
              quill?.insertText(quill?.getSelection()?.index || 0, "\n");
            },
          },
        },
      },
    },
  },
  disabled: false,
});

const toggleToolbar = () => {
  isToolbarVisible.value = !isToolbarVisible.value;
  const toolbarElement = editorRef.value?.querySelector(".ql-toolbar");

  if (toolbarElement) {
    toolbarElement.classList.toggle("hidden");
  }
};

const onChangeImage = (event: Event) => {
  const fileInputElement = event.target as HTMLInputElement;

  if (fileInputElement?.files?.[0]) {
    image.value = fileInputElement.files[0];
    imageSrc.value = URL.createObjectURL(image.value);
  }
};

const handleReaction = (emoji: { native: string }) => {
  let lastIndex = quill?.getText().length - 1;

  quill?.insertText(lastIndex, emoji.native);
  isOpen.value = false;
};

const onEditorReady = (data) => {
  quill = data;
  text.value = quill?.getText();

  if (props.defaultValue?.ops) {
    quill?.setContents(props.defaultValue.ops);
  }
  quill?.focus();
};

const onEditorContentUpdate = () => {
  text.value = quill?.getText();
};

const submit = () => {
  emit("submit", {
    body: JSON.stringify(quill?.getContents()),
    image: image.value,
  });
};

const removeImage = () => {
  image.value = null;
  imageElementRef.value = null;
  imageSrc.value = "";
};

watch(
  () => props.disabled,
  (newVal) => {
    if (newVal) {
      quill?.disable();
    } else {
      quill?.enable();
    }
  }
);
</script>

<template>
  <div class="flex flex-col w-full mt-auto">
    <input
      type="file"
      accept="image/*"
      ref="imageElementRef"
      @change="onChangeImage"
      class="hidden"
    />

    <div
      :class="
        cn(
          'flex flex-col border border-slate-200 rounded-md focus-within:border-slate-300 focus-within:shadow-sm transition overflow-hidden  bg-white',
          disabled && 'opacity-50'
        )
      "
    >
      <div ref="containerRef" class="h-full ql-custom" />
      <div ref="editor">
        <quill-editor
          v-model:value="state.content"
          :options="state.editorOption"
          @ready="onEditorReady($event)"
          @change="onEditorContentUpdate"
        />
      </div>
      <div v-if="!!image" class="p-2">
        <div
          class="relative size-[62px] flex items-center justify-center group/image"
        >
          <Hint label="Remove image">
            <button
              @click="removeImage()"
              class="hidden group-hover/image:flex rounded-full bg-black/70 hover:bg-black absolute -top-2.5 -right-2.5 text-white size-6 z-[4] border-2 border-white items-center justify-center"
            >
              <XIcon class="size-3.5" />
            </button>
          </Hint>
          <img
            :src="imageSrc"
            alt="Uploaded"
            fill
            class="rounded-xl overflow-hidden border object-cover"
          />
        </div>
      </div>
      <div class="flex px-2 pb-2 z-[5]">
        <Hint :label="isToolbarVisible ? 'Hide formatting' : 'Show formatting'">
          <Button
            :disabled="disabled"
            size="iconSm"
            variant="ghost"
            @click="toggleToolbar"
          >
            <PiTextAa class="size-4" />
          </Button>
        </Hint>

        <Popover :open="isOpen" @update-open="isOpen = !isOpen">
          <PopoverTrigger as-child>
            <Button
              :disabled="disabled"
              size="iconSm"
              variant="ghost"
              @click="isOpen = !isOpen"
            >
              <Smile class="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[340px] p-0">
            <Picker
              ref="pop-over"
              v-if="isOpen"
              :data="emojiIndex"
              :show-preview="false"
              @select="handleReaction"
            />
          </PopoverContent>
        </Popover>

        <Hint v-if="variant === 'create'" label="Image">
          <Button
            @click="imageElementRef?.click()"
            :disabled="disabled"
            size="iconSm"
            variant="ghost"
          >
            <ImageIcon class="size-4" />
          </Button>
        </Hint>

        <div
          v-if="variant === 'update'"
          class="ml-auto flex items-center gap-x-2"
        >
          <Button
            variant="outline"
            size="sm"
            @click="emit('cancel')"
            :disabled="disabled"
          >
            Cancel
          </Button>
          <Button
            :disabled="disabled || isEmpty"
            @click="submit()"
            size="sm"
            class="bg-[#007a5a] hover:bg-[#007a5a]/80 text-white"
          >
            Save
          </Button>
        </div>

        <Button
          v-if="variant === 'create'"
          size="iconSm"
          :disabled="disabled || isEmpty"
          :class="
            cn(
              'ml-auto',
              isEmpty
                ? 'bg-white hover:bg-white text-muted-foreground'
                : 'bg-[#007a5a] hover:bg-[#007a5a]/80 text-white'
            )
          "
          @click="submit()"
        >
          <MdSend class="size-4" />
        </Button>
      </div>
    </div>

    <div
      v-if="variant === 'create'"
      :class="
        cn(
          'p-2 text-[10px] text-muted-foreground flex justify-end opacity-0 transition ml-auto',
          !isEmpty && 'opacity-100'
        )
      "
    >
      <p><strong>Shift + Return</strong> to add a new line</p>
    </div>
  </div>
</template>
