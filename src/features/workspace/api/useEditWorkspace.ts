import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexMutation } from "@convex-vue/core";

type ResponseType = Id<"workspaces"> | null;

export const useEditWorkspace = () => {
    const data = ref<ResponseType>(null);
    const error = ref<Error | null>(null);

    const { isLoading, mutate } = useConvexMutation(
        api.workspaces.update,
        {
            onSuccess() {
                toast.success("Workspace updated");
            },
            onError: () => {
                toast.error("Failed to update channel");
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
