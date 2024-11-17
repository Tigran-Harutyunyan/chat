import { defineStore } from "pinia";
import { ref } from 'vue';

export const useCollections = defineStore("collectiions", () => {
    const workspaces = ref();

    function saveWorkSpaces(data) {
        if (data && Array.isArray(data)) {
            workspaces.value = data;
        }
    }

    return {
        workspaces,
        saveWorkSpaces,
    };
});