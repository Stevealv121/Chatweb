import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import UserOperations from "../../../../graphql/operations/user";
import ConversationOperations from "../../../../graphql/operations/conversation";
import { CreateConversationData, CreateConversationInput, SearchedUser, SearchUsersData, SearchUsersInput } from "../../../../util/types";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";
import { Session } from "next-auth";
import router from "next/router";

interface IConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: Session;
}

const ConversationModal: React.FC<IConversationModalProps> = ({ isOpen, onClose, session }) => {

    const { user: { id: userId }, } = session;
    const [username, setUsername] = useState<string>("");
    const [searchUsers, {
        data: searchUsersData,
        loading: searchUsersLoading,
        error: searchUsersError }] = useLazyQuery<SearchUsersData,
            SearchUsersInput>(UserOperations.Queries.searchUsers);
    const [participants, setParticipants] = useState<Array<SearchedUser>>([]);
    const [createConversation, { loading: createConversationLoading }] = useMutation<
        CreateConversationData, CreateConversationInput>(ConversationOperations.Mutations.createConversation);

    const onSearch = (event: React.FormEvent) => {
        event.preventDefault();
        searchUsers({ variables: { username } });
    }

    const addParticipant = (user: SearchedUser) => {
        setParticipants((prev) => [...prev, user]);
        setUsername("");
    }

    const removeParticipant = (userId: string) => {
        setParticipants((prev) => prev.filter((user) => user.id !== userId));
    }

    const onCreateConversation = async () => {
        const participantsIds = [userId, ...participants.map((user) => user.id)];
        try {
            const { data, errors } = await createConversation({
                variables: {
                    participantsIds,
                },
            });
            if (!data?.createConversation || errors) {
                throw new Error("Failed to create conversation");
            }
            const {
                createConversation: { conversationId },
            } = data;
            router.push({ query: { conversationId } });
            /**
           * Clear state and close modal
           * on successful creation
           */
            setParticipants([]);
            setUsername("");
            onClose();

        } catch (error: any) {
            console.log("OnCreateConversation error: ", error);
            toast.error(error?.message)
        }
    }

    return (
        <>
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent bg="yellow.700">
                    <ModalHeader>Create a Conversation</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <form onSubmit={onSearch}>
                            <Stack spacing={4}>
                                <Input placeholder="Enter a username" _placeholder={{ color: "blue.100" }}
                                    value={username}
                                    onChange={(event) => setUsername(event.target.value)} />
                                <Button id="golden" type="submit" disabled={!username} isLoading={searchUsersLoading}>
                                    Search
                                </Button>
                            </Stack>
                        </form>
                        {searchUsersData?.searchUsers && (
                            <UserSearchList users={searchUsersData.searchUsers}
                                addParticipant={addParticipant} />)}
                        {participants.length > 0 && (
                            <>
                                <Participants participants={participants}
                                    removeParticipant={removeParticipant} />
                                <Button id="accent" width="100%" mt={6}
                                    onClick={onCreateConversation}
                                    isLoading={createConversationLoading}>
                                    Create Conversation
                                </Button>
                            </>
                        )}
                    </ModalBody>
                </ModalContent>
            </Modal>
        </>
    );
};

export default ConversationModal;
