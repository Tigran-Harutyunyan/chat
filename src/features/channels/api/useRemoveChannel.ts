import { toast } from 'vue-sonner';
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";

export const useRemoveChannel = (fn: (deletedId: string) => void) => {

    const { isLoading, mutate } = useConvexMutation(
        api.channels.remove,
        {
            onSuccess(deletedId: string) {
                fn(deletedId);
                toast.success("Channel removed");
            }
        }
    );

    return {
        mutate,
        isLoading,
    };
};
