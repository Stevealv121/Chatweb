import { Session } from "next-auth";
import { Center, Stack, Text, Button, Image, Input } from "@chakra-ui/react";
import { signIn } from "next-auth/react";
import { useState } from "react";

interface IAuthProps {
    session: Session | null;
    reloadSession: () => void;
}

const Auth: React.FunctionComponent<IAuthProps> = ({ session, reloadSession }) => {

    const [username, setUsername] = useState('');

    const onSubmit = async () => {
        try {
            /**CreateUsername mutation to send our username to the GraphQL API */

        } catch (error) {
            console.log("OnSubmit error", error);

        }
    }

    return (
        <Center height="100vh" border="1px solid red">
            <Stack spacing={8} align='center'>
                {session ? (
                    <>
                        <Text fontSize="3xl">Create Username</Text>
                        <Input placeholder="Enter a username"
                            value={username}
                            onChange={(event) => setUsername(event.target.value)} />
                        <Button width="100%" colorScheme="yellow" backgroundColor="#CC9900" color="white"
                            onClick={onSubmit}>Save</Button>
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
