import { defineStore } from "pinia";
import { ref } from 'vue';

export const useUser = defineStore("user-store", () => {
    const isSignedIn = ref<boolean | undefined>(undefined);

    function setSignedIn(newState: boolean | undefined) {
        if (newState === undefined) return;
        isSignedIn.value = newState;
    }

    return {
        isSignedIn,
        setSignedIn
    };
});