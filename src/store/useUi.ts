import { defineStore } from "pinia";
import { ref } from 'vue'
import { Id } from "@convex/dataModel";

type messageType = Id<"workspaces">;

export const useUi = defineStore("use-ui", () => {
    const newMessageId = ref<messageType>();
    const workspaces = ref();

    const saveNewMessageId = (id: messageType) => {
        if (id) {
            newMessageId.value = id
        }
    };

    const saveWorkspaces = (data) => {
        workspaces.value = data;
    };

    return {
        newMessageId,
        workspaces,
        saveNewMessageId,
        saveWorkspaces
    };
});