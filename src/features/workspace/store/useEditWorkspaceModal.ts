import { defineStore } from "pinia";
import { ref } from 'vue';

export const useEditWorkspaceModal = defineStore("edit-workspace-modal", () => {
    const isOpen = ref(false);

    function onOpen() {
        isOpen.value = true;
    }

    function onClose() {
        isOpen.value = false;
    }

    return {
        isOpen,
        onOpen,
        onClose,
    };
});