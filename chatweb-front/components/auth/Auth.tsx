import { Session } from "next-auth";
import { Center, Stack, Text, Button, Image, Input } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import UserOperations from "../../graphql/operations/user";
import { useMutation } from "@apollo/client";
import { ICreateUsernameData, ICreateUsernameVariables } from "../../util/types";
import toast from "react-hot-toast";

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session, reloadSession }) => {

    const [username, setUsername] = useState('');
    const [createUsername, { loading, error }] = useMutation<ICreateUsernameData, ICreateUsernameVariables
    >(UserOperations.Mutations.createUsername)

    const onSubmit = async () => {
        if (!username) return;
        try {
            const { data } = await createUsername({
                variables: {
                    username,
                },
            });

            if (!data?.createUsername) {
                throw new Error();
            }

            if (data.createUsername.error) {
                const {
                    createUsername: { error },
                } = data;

                toast.error(error);
                return;
            }

            toast.success("Username successfully created");

            /**
             * Reload session to obtain new username
             */
            reloadSession();
        } catch (error) {
            toast.error("There was an error");
            console.log("onSubmit error", error);
        }
    }

    return (
        <Center height="100vh" border="1px solid red">
            <Stack spacing={8} align='center'>
                {session ? (
                    <>
                        <Text fontSize="3xl">Create Username</Text>
                        <Input placeholder="Enter a username" _placeholder={{ color: "blue.100" }}
                            value={username}
                            onChange={(event) => setUsername(event.target.value)} />
                        <Button width="100%" colorScheme="yellow" backgroundColor="#CC9900" color="white"
                            onClick={onSubmit} isLoading={loading}>Save</Button>
                    </>) : (
                    <>
                        <Text fontSize="3xl">GoldenChat</Text>
                        <Button colorScheme="yellow" backgroundColor="#CC9900" color="white" onClick={() => signIn('google')} leftIcon={<Image height="20px" src="/images/googlelogo.png" />}>
                            Continue with Google</Button>
                    </>)}
            </Stack>
        </Center>
    );
};

export default Auth;
