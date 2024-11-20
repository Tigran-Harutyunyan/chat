<script setup lang="ts">
import { withDefaults, useRef, ref, reactive, computed, watch } from "vue";
import { quillEditor } from "vue3-quill";

import { MdSend } from "vue3-icons/md";
import { PiTextAa } from "vue3-icons/pi";
import { ImageIcon, Smile, XIcon } from "lucide-vue-next";
import { cn } from "@/lib/utils";

import Hint from "@/components/Hint.vue";
import { Button } from "./ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Emoji picker
import data from "emoji-mart-vue-fast/data/all.json";
import { Picker, EmojiIndex } from "emoji-mart-vue-fast/src";
import "emoji-mart-vue-fast/css/emoji-mart.css";

type EditorValue = {
  image: File | null;
  body: string;
};

type EmitType = {
  (event: "onSubmit", value: EditorValue): void;
  (event: "onCancel"): void;
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

const text = ref("");
const image = ref<File | null>(null);
const imageSrc = ref("");
const isToolbarVisible = ref(true);
const quillRef = ref(null);
const submitRef = ref();
const imageElementRef = ref<HTMLInputElement>(null);
const isEmpty = computed(
  () =>
    !image.value && text.value.replace(/<(.|\n)*?>/g, "").trim().length === 0
);

let emojiIndex = new EmojiIndex(data);

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
              const text = quillRef.value.getText();
              const addedImage = imageElementRef.value.files?.[0] || null;

              const isEmpty =
                !addedImage &&
                text.replace(/<(.|\n)*?>/g, "").trim().length === 0;

              if (isEmpty) return;

              const body = JSON.stringify(quillRef.value.getContents());
              submitRef.value = { body, image: addedImage };
            },
          },
          shift_enter: {
            key: "Enter",
            shiftKey: true,
            handler: () => {
              quillRef.value.insertText(
                quillRef.value.getSelection()?.index || 0,
                "\n"
              );
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
  const toolbarElement = document?.querySelector(".ql-toolbar");

  if (toolbarElement) {
    toolbarElement.classList.toggle("hidden");
  }
};

const onChangeImage = (event) => {
  image.value = event.target.files[0];
  imageSrc.value = URL.createObjectURL(image.value);
};

const insertEmoji = (emoji) => {
  let lastIndex = quillRef.value.getText().length - 1;
  quillRef.value.insertText(lastIndex, emoji.native);
};

const onEditorReady = (quill) => {
  quillRef.value = quill;
  text.value = quill.getText();
  quill.focus();
};

const onEditorContentUpdate = (quill) => {
  text.value = quillRef.value.getText();
};

const submit = () => {
  emit("onSubmit", {
    body: JSON.stringify(quillRef.value?.getContents()),
    image: image.value,
  });
};

const removeImage = () => {
  image.value = null;
  imageElementRef.value = "";
  imageSrc.value = "";
};

watch(
  () => props.disabled,
  (newVal) => {
    if (newVal) {
      quillRef.value.disable();
    } else {
      quillRef.value.enable();
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
      <div>
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

        <Popover>
          <PopoverTrigger as-child>
            <Button :disabled="disabled" size="iconSm" variant="ghost">
              <Smile class="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent class="w-[340px] p-0">
            <Picker
              :data="emojiIndex"
              :show-preview="false"
              @select="insertEmoji"
            />
          </PopoverContent>
        </Popover>

        <Hint v-if="variant === 'create'" label="Image">
          <Button
            @click="imageElementRef.click()"
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
            @click="emit('onCancel')"
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
