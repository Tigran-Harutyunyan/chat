import { api } from "@convex/api";
import { useConvexQuery } from "@convex-vue/core";
import { useClerkUser } from '@/composables/useClerkUser';
export const useGetWorkspaces = () => {
    const { email } = useClerkUser();
    const { data, isLoading } = useConvexQuery(api.workspaces.get, { email });
    return { data, isLoading };
};
