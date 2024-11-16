import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';
export const useChannelId = () => {
    const route = useRoute();
    const channelId = ref();

    watch(
        () => route.path,
        () => {
            channelId.value = route.params.channelId;
        },
        {
            immediate: true,
        }
    );

    return {
        channelId
    };
};