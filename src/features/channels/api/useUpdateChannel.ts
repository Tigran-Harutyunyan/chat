import { toast } from 'vue-sonner';
import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@convex-vue/core";

export const useUpdateChannel = (fn: () => void) => {

    const { isLoading, mutate } = useConvexMutation(
        api.channels.update,
        {
            onSuccess() {
                toast.success("Channel updated");
                fn();
            }
        }
    );

    return {
        mutate,
        isLoading,
    };
};
