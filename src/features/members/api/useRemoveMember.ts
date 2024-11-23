import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';
import { useRouter } from "vue-router";
export const useRemoveMember = () => {
    const router = useRouter();
    const { isLoading, mutate } = useConvexMutation(
        api.members.remove,
        {
            onSuccess() {
                toast.success("You left the workspace");
                router.replace("/");
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
