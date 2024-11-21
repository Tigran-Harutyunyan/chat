import { api } from "../../../../convex/_generated/api";
import { Id } from "../../../../convex/_generated/dataModel";
import { useConvexPaginatedQuery } from "@convex-vue/core";
import { useClerkUser } from '@/composables/useClerkUser';

const BATCH_SIZE = 20;

interface UseGetMessagesProps {
    channelId?: Id<"channels">;
    conversationId?: Id<"conversations">;
    parentMessageId?: Id<"messages">;
};

export const useGetMessages = ({
    channelId,
    conversationId,
    parentMessageId,
}: UseGetMessagesProps) => {
    const { email } = useClerkUser();
    const { data, isLoading, isLoadingMore, isDone, loadMore } = useConvexPaginatedQuery(api.messages.get, { email, channelId, conversationId, parentMessageId }, {
        numItems: BATCH_SIZE
    });
    return { data, isLoading, isLoadingMore, isDone, loadMore };
};
