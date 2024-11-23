import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexQuery } from "@convex-vue/core";
import { useClerkUser } from '@/composables/useClerkUser';
export const useGetChannel = (channelId: Id<"channels">) => {
    if (!channelId) return { data: null, isLoading: false };

    const { email } = useClerkUser();
    const { data, isLoading } = useConvexQuery(api.channels.getById, { email, id: channelId });
    return { data, isLoading };
};
