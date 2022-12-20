import { Flex, Stack, Text } from "@chakra-ui/react";
import { SearchedUser } from "../../../../util/types";
import { IoIosCloseCircleOutline } from "react-icons/io";

interface IParticipantsProps {
    participants: Array<SearchedUser>;
    removeParticipant: (userId: string) => void;
}

const Participants: React.FC<IParticipantsProps> = ({ participants, removeParticipant }) => {
    return (
        <Flex mt={8} gap="10px" flexWrap="wrap">
            {participants.map((participant) => (
                <Stack direction="row" align="center" bg="whiteAlpha.200"
                    borderRadius={4} p={2} key={participant.id}>
                    <Text>{participant.username}</Text>
                    <IoIosCloseCircleOutline onClick={() => removeParticipant(participant.id)}
                        size={20} cursor="pointer" />
                </Stack>
            ))}
        </Flex>

    );
};

export default Participants;
