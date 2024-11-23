
import { api } from "@convex/api";
import { useConvexMutation } from "@convex-vue/core";
import { toast } from 'vue-sonner';
import { useRouter } from 'vue-router';

export const useCreateOrGetConversation = (fn: (id: string) => void) => {
    const router = useRouter();
    const { isLoading, mutate } = useConvexMutation(
        api.conversations.createOrGet,
        {
            onSuccess(id) {
                fn(id);
            },
            onError(err) {
                const errMessage = err.toString();
                const errPattern = 'Member not found';

                if (errMessage.includes(errPattern)) {
                    router.push('/workspace')
                } else {
                    toast.error("Failed to create or get conversation");
                }

            },
        }
    );

    return {
        mutate,
        isLoading,
    };
};
