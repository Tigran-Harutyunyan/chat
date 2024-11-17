import { defineStore } from "pinia";
import { ref } from 'vue';

export const useInviteModal = defineStore("invite-modal", () => {
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