import { ref } from 'vue';
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';
import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexMutation } from "@convex-vue/core";

type ResponseType = Id<"workspaces"> | null;

export const useCreateChannel = (workspaceId: string) => {
    const data = ref<ResponseType>(null);
    const error = ref<Error | null>(null);
    const router = useRouter();

    const { isLoading, mutate } = useConvexMutation(
        api.channels.create,
        {
            onSuccess(id) {
                toast.success("Channel created");
                router.push(`/workspace/${workspaceId}/channel/${id}`);
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
