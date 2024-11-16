import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
export const useWorkspaceId = () => {
    const route = useRoute();
    const workspaceId = ref();

    watch(
        () => route.path,
        () => {
            workspaceId.value = route.params.workspaceId;
        },
        {
            immediate: true,
        }
    );

    return {
        workspaceId
    };
};