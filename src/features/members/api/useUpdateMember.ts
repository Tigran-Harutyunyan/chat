import { api } from "@convex/api";
import { toast } from 'vue-sonner';
import { useConvexMutation } from "@convex-vue/core";

export const useUpdateMember = () => {
    const { isLoading, mutate } = useConvexMutation(
        api.members.update,
        {
            onSuccess() {
                toast.success("Role changed");
            },
            onError: () => {
                toast.error("Failed to change role");
            }
        }
    );

    return {
        mutate,
        isLoading,
    };
};
