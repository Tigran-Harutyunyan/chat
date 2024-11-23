import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexMutation } from "@convex-vue/core";

type ResponseType = Id<"workspaces"> | null;

export const useNewJoinCode = (cb: (value: string) => void) => {
    const data = ref<ResponseType>(null);
    const error = ref<Error | null>(null);

    const { isLoading, mutate } = useConvexMutation(
        api.workspaces.newJoinCode,
        {
            onSuccess: (id: string) => {
                cb(id);
                toast.success("Invite code regenerated");
            },
            onError: () => {
                toast.error("Failed to regenerate invite code");
            }
        }
    );

    return {
        data,
        error,
        mutate,
        isLoading,
    };
};
