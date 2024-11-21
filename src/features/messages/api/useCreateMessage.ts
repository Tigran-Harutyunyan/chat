import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@convex-vue/core";

export const useCreateMessage = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.messages.create
    );

    return {
        mutate,
        isLoading,
    };
};
