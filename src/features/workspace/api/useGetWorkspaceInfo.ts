import { api } from "@convex/api";
import { useConvexQuery } from "@convex-vue/core";
import { Id } from "@convex/dataModel";

interface UseGetWorkspaceProps {
    id: Id<"workspaces">;
    email: string
};

export const useGetWorkspaceInfo = ({ id, email }: UseGetWorkspaceProps) => {
    if (!id) return { data: null, isLoading: false };
    const { data, isLoading } = useConvexQuery(api.workspaces.getInfoById, { id, email });
    return { data, isLoading };
};
