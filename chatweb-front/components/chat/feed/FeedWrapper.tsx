import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useRouter } from "next/router";
import MessageInput from "./messages/Input";
import Messages from "./messages/Messages";
import MessagesHeader from "./messages/MessagesHeader";

interface IFeedWrapperProps {
    session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
    const router = useRouter();
    const { conversationId } = router.query;
    const { user: { id: userId
    } } = session;
    return (
        <Flex display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }} width="100%" direction="column">
            {conversationId && typeof conversationId === "string" ? (
                <>
                    <Flex direction="column"
                        flexGrow={1} overflow="hidden"
                        justify="space-between"
                    >
                        <MessagesHeader userId={userId} conversationId={conversationId} />
                        <Messages conversationId={conversationId} userId={userId} />
                    </Flex>
                    <MessageInput session={session} conversationId={conversationId} />
                </>
            ) : (
                <Flex>No conversation selected</Flex>)}
        </Flex>
    );
};

export default FeedWrapper;
