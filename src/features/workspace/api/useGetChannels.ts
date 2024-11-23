import { api } from "@convex/api";
import { Id } from "@convex/dataModel";
import { useConvexQuery } from "@convex-vue/core";
import { useClerkUser } from '@/composables/useClerkUser';
export const useGetChannels = (workspaceId: Id<"workspaces">) => {
    if (!workspaceId) return { data: null, isLoading: false };

    const { email } = useClerkUser();
    const { data, isLoading } = useConvexQuery(api.channels.get, { email, workspaceId });
    return { data, isLoading };
};
