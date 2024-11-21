<script setup lang="ts">
import { ref, useTemplateRef, onMounted } from "vue";
import Quill from "quill";

interface RendererProps {
  value: string;
}

const props = defineProps<RendererProps>();

const rendererRef = useTemplateRef("renderer");
const isEmpty = ref(true);

onMounted(() => {
  try {
    // Parse the Quill Delta value from props
    const contents = JSON.parse(props.value);

    // Create a Quill instance for rendering the contents
    const quill = new Quill(document.createElement("div"));
    quill.enable(false);
    quill.setContents(contents);

    isEmpty.value =
      quill
        .getText()
        .replace(/<(.|\n)*?>/g, "")
        .trim().length === 0;

    // Safely set the innerHTML
    if (rendererRef.value) {
      rendererRef.value.innerHTML = quill.root.innerHTML;
    }
  } catch (error) {
    console.error("Error parsing Quill contents:", error);
  }
});
</script>

<template>
  <div v-show="!isEmpty" ref="renderer" class="ql-editor ql-renderer" />
</template>
