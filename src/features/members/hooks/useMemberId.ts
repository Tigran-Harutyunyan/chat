import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
export const useMemberId = () => {
    const route = useRoute();
    const memberId = ref();

    watch(
        () => route.path,
        () => {
            memberId.value = route.params.memberId;
        },
        {
            immediate: true,
        }
    );

    return {
        memberId
    };
};