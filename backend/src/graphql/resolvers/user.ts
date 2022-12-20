import { CreateUsernameResponse, GraphQLContext } from "../../util/types";
import { verifyAndCreateUsername } from "../../util/functions";

const resolvers = {
    Query: {

    },
    Mutation: {
        createUsername: async function createUsername(
            _: any,
            args: { username: string },
            context: GraphQLContext
        ): Promise<CreateUsernameResponse> {
            const { session, prisma } = context;

            if (!session?.user) {
                return {
                    error: "Not authorized",
                };
            }

            const { id } = session.user;
            const { username } = args;

            return await verifyAndCreateUsername({ userId: id, username }, prisma);
        },
    },
};

export default resolvers;
