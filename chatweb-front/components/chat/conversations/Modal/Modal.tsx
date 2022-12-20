import { useLazyQuery, useQuery } from "@apollo/client";
import { Button, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { useState } from "react";
import toast from "react-hot-toast";
import UserOperations from "../../../../graphql/operations/user";
import { SearchedUser, SearchUsersData, SearchUsersInput } from "../../../../util/types";
import Participants from "./Participants";
import UserSearchList from "./UserSearchList";

interface IConversationModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const ConversationModal: React.FC<IConversationModalProps> = ({ isOpen, onClose }) => {
    const [username, setUsername] = useState<string>("");
    const [searchUsers, { data, loading, error }] = useLazyQuery<SearchUsersData,
        SearchUsersInput>(UserOperations.Queries.searchUsers);
    const [participants, setParticipants] = useState<Array<SearchedUser>>([]);

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
        try {

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
                                <Button id="golden" type="submit" disabled={!username} isLoading={loading}>Search</Button>
                            </Stack>
                        </form>
                        {data?.searchUsers && (
                            <UserSearchList users={data.searchUsers}
                                addParticipant={addParticipant} />)}
                        {participants.length > 0 && (
                            <>
                                <Participants participants={participants}
                                    removeParticipant={removeParticipant} />
                                <Button id="accent" width="100%" mt={6}
                                    onClick={() => { }}>
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
