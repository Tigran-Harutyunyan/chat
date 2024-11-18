import { api } from "../../../../convex/_generated/api";
import { useConvexQuery } from "@convex-vue/core";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceProps {
    id: Id<"workspaces">;
    email: string
};

export const useGetWorkspaceInfo = ({ id, email }: UseGetWorkspaceProps) => {
    if (!id) return { data: null, isLoading: false };
    const { data, isLoading } = useConvexQuery(api.workspaces.getInfoById, { id, email });
    return { data, isLoading };
};
