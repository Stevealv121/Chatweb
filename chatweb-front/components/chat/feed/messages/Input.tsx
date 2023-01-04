import { useMutation } from '@apollo/client';
import { Box, Input } from '@chakra-ui/react';
import { ObjectID } from 'bson';
import { Session } from 'next-auth';
import * as React from 'react';
import { toast } from 'react-hot-toast';
import { SendMessagesArguments } from '../../../../../backend/src/util/types';
import MessageOperations from '../../../../graphql/operations/message';

interface IMessageInputProps {
    session: Session;
    conversationId: string;
}

const MessageInput: React.FC<IMessageInputProps> = ({ session, conversationId }) => {
    const [messageBody, setMessageBody] = React.useState<string>("");
    const [sendMessage] = useMutation<{ sendMessage: boolean }, SendMessagesArguments>(MessageOperations.Mutation.sendMessage)
    const onSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            //call send message mutation
            const { id: senderId } = session.user;
            const messageId = new ObjectID().toString();
            const newMessage: SendMessagesArguments = {
                id: messageId,
                senderId,
                conversationId,
                body: messageBody,
            };
            const { data, errors } = await sendMessage({
                variables: {
                    ...newMessage,
                },
            });
            if (!data?.sendMessage || errors) {
                throw new Error("Error sending message");
            }
        } catch (error: any) {
            console.log("Error sending message: ", error);
            toast.error(error?.message);
        }
    }
    return (
        <Box px={4} py={6} width="100%">
            <form onSubmit={onSendMessage}>
                <Input value={messageBody}
                    size="md"
                    placeholder="New Message"
                    _focus={{
                        boxShadow: "none",
                        borderColor: "whiteAlpha.300"
                    }}
                    resize="none"
                    onChange={(event) => setMessageBody(event.target.value)} />
            </form>

        </Box>
    );
};

export default MessageInput;
