import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from "vue-sonner";

export const useUpdateMessage = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.messages.update,
        {
            onSuccess() {
                toast.success("Message updated");
            },
            onError() {
                toast.error("Failed to update the message");
            }
        }
    );

    return {
        mutate,
        isLoading,
    };
};
