import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexMutation } from "@convex-vue/core";
import { useRouter } from 'vue-router';

type ResponseType = Id<"workspaces"> | null;

export const useJoin = (cb: (value: string) => void) => {
    const data = ref<ResponseType>(null);
    const error = ref<Error | null>(null);
    const router = useRouter();

    const { isLoading, mutate } = useConvexMutation(
        api.workspaces.join,
        {
            onSuccess: (id: string) => {
                router.replace(`/workspace/${id}`);
                toast.success("Workspace joined");
            },
            onError: () => {
                toast.error("Failed to join workspace");
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
