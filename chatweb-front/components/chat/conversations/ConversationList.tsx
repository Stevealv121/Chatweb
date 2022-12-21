import { Box, Text } from "@chakra-ui/react";
import { Session } from "next-auth";
import { useState } from "react";
import { ConversationPopulated } from "../../../../backend/src/util/types";
import ConversationItem from "./ConversationItem";
import ConversationModal from "./Modal/Modal";

interface IConversationListProps {
    session: Session;
    conversations: Array<ConversationPopulated>;
}

const ConversationList: React.FC<IConversationListProps> = ({ session, conversations }) => {
    const [isOpen, setIsOpen] = useState(false);
    const onOpen = () => setIsOpen(true);
    const onClose = () => setIsOpen(false);
    return (
        <Box width="100%">
            <Box py={2} px={4} mb={4}
                borderRadius={4} cursor="pointer"
                onClick={onOpen}
                bg="yellow.700">
                <Text textAlign="center" fontWeight={500} color="whiteAlpha.800">
                    Find or start a conversation</Text>
            </Box>
            <ConversationModal session={session} isOpen={isOpen} onClose={onClose} />
            {conversations.map((conversation) => (
                <ConversationItem key={conversation.id} conversation={conversation} />
            ))}
        </Box>
    );
};

export default ConversationList;
