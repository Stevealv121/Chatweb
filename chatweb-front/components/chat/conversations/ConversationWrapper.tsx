import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData, ConversationCreatedSubscriptionData } from "../../../util/types";
import { useEffect } from "react";
import { useRouter } from "next/router";

interface IConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({ session }) => {
    const {
        data: conversationsData,
        error: conversationsError,
        loading: conversationLoading,
        subscribeToMore
    } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations)

    const router = useRouter();
    const { query: { conversationId } } = router;

    const onViewConversation = (conversationId: string) => {
        //1.Push the conversationId to the router query params
        router.push({ query: { conversationId } })
        //2.Mark the conversation as read
    };

    const subscribeToNewConversations = () => {
        subscribeToMore({
            document: ConversationOperations.Subscriptions.conversationCreated,
            updateQuery: (
                prev,
                { subscriptionData }: ConversationCreatedSubscriptionData
            ) => {
                if (!subscriptionData.data) return prev;

                const newConversation = subscriptionData.data.conversationCreated;

                return Object.assign({}, prev, {
                    conversations: [newConversation, ...prev.conversations],
                });
            },
        });
    };

    useEffect(() => {
        subscribeToNewConversations();
    }, []);

    return (
        <Box width={{ base: '100%', md: '400px' }} border="1px solid red"
            bg="yellow.600" py={6} px={3}
            display={{ base: conversationId ? 'none' : 'flex', md: 'flex' }}>

            <ConversationList session={session} conversations={conversationsData?.conversations || []}
                onViewConversation={onViewConversation} />
        </Box>
    );
};

export default ConversationWrapper;
