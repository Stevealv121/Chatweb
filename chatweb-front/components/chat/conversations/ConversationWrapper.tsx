import { Box } from "@chakra-ui/react";
import { Session } from "next-auth";
import ConversationList from "./ConversationList";
import ConversationOperations from "../../../graphql/operations/conversation";
import { useQuery } from "@apollo/client";
import { ConversationsData } from "../../../util/types";

interface IConversationWrapperProps {
    session: Session;
}

const ConversationWrapper: React.FC<IConversationWrapperProps> = ({ session }) => {
    const {
        data: conversationsData,
        error: conversationsError,
        loading: conversationLoading
    } = useQuery<ConversationsData, null>(ConversationOperations.Queries.conversations)
    //log teh data
    console.log(conversationsData)
    return (
        <Box width={{ base: '100%', md: '400px' }} border="1px solid red"
            bg="yellow.600" py={6} px={3}>

            <ConversationList session={session} conversations={conversationsData?.conversations || []} />
        </Box>
    );
};

export default ConversationWrapper;
