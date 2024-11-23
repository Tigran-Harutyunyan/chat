import { defineStore } from "pinia";
import { useRouteQuery } from '@vueuse/router'
import { useRoute, useRouter } from 'vue-router';

export const usePanel = defineStore("use-panel", () => {
    const parentMessageId = useRouteQuery('parentMessageId');
    const profileMemberId = useRouteQuery('profileMemberId');

    const route = useRoute();
    const router = useRouter();

    const onOpenProfile = (memberId: string) => {
        parentMessageId.value = null;
        profileMemberId.value = memberId;

        const query = Object.assign({}, route.query);
        delete query.parentMessageId;
        query.profileMemberId = memberId;
        router.replace({ query })
    };

    const onOpenMessage = (messageId: string) => {
        parentMessageId.value = messageId;
        profileMemberId.value = null;

        const query = Object.assign({}, route.query);
        delete query.profileMemberId;
        query.parentMessageId = messageId;
        router.replace({ query })
    };

    const onClose = () => {
        parentMessageId.value = null;
        profileMemberId.value = null;

        const query = Object.assign({}, route.query);
        delete query.parentMessageId;
        delete query.profileMemberId;
        router.replace({ query });
    };

    return {
        parentMessageId,
        profileMemberId,
        onOpenProfile,
        onOpenMessage,
        onClose,
    };
});