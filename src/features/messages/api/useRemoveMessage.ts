import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from "vue-sonner";

export const useRemoveMessage = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.messages.remove,
        {
            onSuccess() {
                toast.success("Message deleted");
            },
            onError() {
                toast.error("Failed to delete message");
            }
        }
    );

    return {
        mutate,
        isLoading,
    };
};
