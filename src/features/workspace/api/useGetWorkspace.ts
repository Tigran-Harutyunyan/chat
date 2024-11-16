import { api } from "../../../../convex/_generated/api";
import { useConvexQuery } from "@convex-vue/core";
import { Id } from "../../../../convex/_generated/dataModel";

interface UseGetWorkspaceProps {
    id: Id<"workspaces">;
    email: string
};

export const useGetWorkspace = ({ id, email }: UseGetWorkspaceProps) => {
    if (!id) return { data: null, isLoading: false };
    const { data, isLoading } = useConvexQuery(api.workspaces.getById, { id, email });
    return { data, isLoading };
};
