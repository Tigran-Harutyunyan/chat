import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexQuery } from "@convex-vue/core";
import { useClerkUser } from '@/composables/useClerkUser';
export const useGetMembers = (workspaceId: Id<"workspaces">) => {
    if (!workspaceId) return { data: null, isLoading: false };

    const { email } = useClerkUser();
    const { data } = useConvexQuery(api.members.get, { email, workspaceId });
    return { data };
};
