import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexMutation } from "@convex-vue/core";
import { useCollections } from "@/features/workspace/store/useCollections";

type ResponseType = Id<"workspaces"> | null;

export const useDeleteWorkspace = () => {
    const data = ref<ResponseType>(null);
    const error = ref<Error | null>(null);
    const router = useRouter();

    const { workspaces } = useCollections();

    const { isLoading, mutate } = useConvexMutation(
        api.workspaces.remove,
        {
            onSuccess(deletedId: string) {
                if (workspaces.value && workspaces.value.length) {
                    const filtered = workspaces.value.filter(w => w._id !== deletedId);

                    if (filtered.length) {
                        router.push(`/workspace/${filtered[0]._id}`);
                    }
                } else {
                    router.push('/workspace');
                }
                toast.success("Workspace deleted");
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
