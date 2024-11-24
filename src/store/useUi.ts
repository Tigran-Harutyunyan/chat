import { defineStore } from "pinia";
import { ref } from 'vue'
import { Id } from "@convex/dataModel";

type messageType = Id<"workspaces">;

export const useUi = defineStore("use-ui", () => {
    const newMessageId = ref<messageType>();

    const saveNewMessageId = (id: messageType) => {
        if (id) {
            newMessageId.value = id
        }
    };

    return {
        newMessageId,
        saveNewMessageId,
    };
});