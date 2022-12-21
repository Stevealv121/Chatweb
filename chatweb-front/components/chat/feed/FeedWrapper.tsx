import { Flex } from "@chakra-ui/react";
import { Session } from "next-auth";
import router from "next/router";

interface IFeedWrapperProps {
    session: Session;
}

const FeedWrapper: React.FC<IFeedWrapperProps> = ({ session }) => {
    const { conversationId } = router.query;
    return (
        <Flex display={{ base: conversationId ? 'flex' : 'none', md: 'flex' }} width="100%" direction="column">
            {conversationId ? (
                <Flex>{conversationId}</Flex>
            ) : (
                <Flex>No conversation selected</Flex>)}
        </Flex>
    );
};

export default FeedWrapper;
