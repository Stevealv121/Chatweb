import { Button, Flex } from "@chakra-ui/react"
import { Session } from "next-auth";
import { signOut } from "next-auth/react"
import ConversationWrapper from "./conversations/ConversationWrapper";
import FeedWrapper from "./feed/FeedWrapper";
interface IChatProps {
    session: Session;
}

const Chat: React.FC<IChatProps> = ({ session }) => {
    return (<Flex height="100vh">
        <ConversationWrapper session={session} />
        <FeedWrapper session={session} />
    </Flex>);
};

export default Chat;
