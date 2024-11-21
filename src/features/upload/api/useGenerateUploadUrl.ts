import { api } from "../../../../convex/_generated/api";
import { useConvexMutation } from "@convex-vue/core";
export const useGenerateUploadUrl = () => {

    const { isLoading, mutate } = useConvexMutation(
        api.upload.generateUploadUrl
    );

    return {
        mutate,
        isLoading,
    };
};
