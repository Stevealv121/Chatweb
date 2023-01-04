import { useQuery } from "@apollo/client";
import { Flex, Stack } from "@chakra-ui/react";
import { MessagesData, MessagesSubscriptionData, MessageVariables } from "../../../../util/types";
import MessageOperations from "../../../../graphql/operations/message";
import { toast } from "react-hot-toast";
import SkeletonLoader from "../../../common/SkeletonLoader";
import { useEffect } from "react";
import MessageItem from "./MessageItem";

interface IMessagesProps {
    conversationId: string;
    userId: string;
}

const Messages: React.FC<IMessagesProps> = ({ conversationId, userId }) => {
    const { data, loading, error, subscribeToMore } = useQuery<MessagesData, MessageVariables>(
        MessageOperations.Query.messages,
        {
            variables: {
                conversationId,
            },
            onError: ({ message }) => {
                toast.error(message);
            },
        }
    )

    const subscribeToMoreMessages = (conversationId: string) => {
        subscribeToMore({
            document: MessageOperations.Subscription.messageSent,
            variables: {
                conversationId
            },
            updateQuery: (prev, { subscriptionData }: MessagesSubscriptionData) => {
                if (!subscriptionData.data) return prev;
                const newMessage = subscriptionData.data.messageSent;
                return Object.assign({}, prev, {
                    messages: [newMessage, ...prev.messages]
                })
            },
        })
    }

    useEffect(() => {
        subscribeToMoreMessages(conversationId);
    }, [conversationId])

    if (error) {
        return null;
    }

    return (
        <Flex direction="column"
            justify="flex-end"
            overflow="hidden"
        >
            {loading && (
                <Stack spacing={4} px={4}>
                    <SkeletonLoader count={4} height="60px" />
                </Stack>
            )}
            {data?.messages && (
                <Flex direction="column-reverse"
                    overflowY="scroll"
                    height="100%">
                    {data.messages.map((message) => (
                        <MessageItem message={message}
                            sentByMe={message.sender.id === userId}
                            key={message.id} />
                    ))}
                </Flex>
            )}
        </Flex>
    );
};

export default Messages;
