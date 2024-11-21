import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexMutation } from "@convex-vue/core";

type ResponseType = Id<"workspaces"> | null;

export const useDeleteWorkspace = () => {
    const data = ref<ResponseType>(null);
    const error = ref<Error | null>(null);
    const router = useRouter();

    const { isLoading, mutate } = useConvexMutation(
        api.workspaces.remove,
        {
            onSuccess() {
                router.push('/workspace');
                toast.success("Workspace deleted");
            },
            onError: () => {
                toast.error("Failed to delete channel");
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
