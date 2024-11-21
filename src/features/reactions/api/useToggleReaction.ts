import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@convex-vue/core";

export const useToggleReaction = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.reactions.toggle
    );

    return {
        mutate,
        isLoading,
    };
};
