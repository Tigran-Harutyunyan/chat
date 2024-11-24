import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';
export const useRemoveMember = () => {

    const { isLoading, mutate } = useConvexMutation(
        api.members.remove,
        {
            onSuccess() {
                toast.success("User left the workspace");
            },
            onError: () => {
                toast.error("Failed to leave the workspace");
            }
        }
    );

    return {
        mutate,
        isLoading,
    };
};
