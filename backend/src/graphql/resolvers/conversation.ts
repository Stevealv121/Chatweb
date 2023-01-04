import { Prisma } from "@prisma/client";
import console from "console";
import { GraphQLError } from "graphql";
import { GraphQLContext, ConversationPopulated, ConversationCreatedSubscriptionPayload } from "../../util/types";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../util/functions";

const resolvers = {
    Query: {
        conversations: async function getConversations(
            _: any,
            args: Record<string, never>,
            context: GraphQLContext
        ): Promise<Array<ConversationPopulated>> {
            const { session, prisma } = context;

            if (!session?.user) {
                throw new GraphQLError("Not authorized");
            }

            try {
                const { id } = session.user;
                /**
                 * Find all conversations that user is part of
                 */
                const conversations = await prisma.conversation.findMany({
                    /**
                     * Below has been confirmed to be the correct
                     * query by the Prisma team. Has been confirmed
                     * that there is an issue on their end
                     * Issue seems specific to Mongo
                     */
                    // where: {
                    //   participants: {
                    //     some: {
                    //       userId: {
                    //         equals: id,
                    //       },
                    //     },
                    //   },
                    // },
                    include: conversationPopulated,
                });

                /**
                 * Since above query does not work
                 */
                return conversations.filter(
                    (conversation) =>
                        !!conversation.participants.find((p) => p.userId === id)
                );
            } catch (error: any) {
                console.log("error", error);
                throw new GraphQLError(error?.message);
            }
        },
    },
    Mutation: {
        createConversation: async (_: any,
            args: { participantsIds: Array<string> }
            , context: GraphQLContext
        ): Promise<{ conversationId: string }> => {
            const { session, prisma, pubsub } = context;
            const { participantsIds } = args;
            if (!session?.user) {
                throw new GraphQLError("Not authorized");
            }

            const { id: userId } = session.user;
            try {
                /**
                 * create Conversation entity
                 */
                const conversation = await prisma.conversation.create({
                    data: {
                        participants: {
                            createMany: {
                                data: participantsIds.map((id) => ({
                                    userId: id,
                                    hasSeenLatestMessage: id === userId,
                                })),
                            },
                        },
                    },
                    include: conversationPopulated,

                });

                pubsub.publish("CONVERSATION_CREATED", {
                    conversationCreated: conversation,
                });

                return { conversationId: conversation.id };
            } catch (error) {
                console.log("createConversation error", error);
                throw new GraphQLError("Error creating conversation");
            }
        },
    },
    Subscription: {
        conversationCreated: {
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext) => {
                    const { pubsub } = context;

                    return pubsub.asyncIterator(["CONVERSATION_CREATED"]);
                },
                (
                    payload: ConversationCreatedSubscriptionPayload,
                    _,
                    context: GraphQLContext
                ) => {
                    const { session } = context;

                    if (!session?.user) {
                        throw new GraphQLError("Not authorized");
                    }

                    const { id: userId } = session.user;
                    const {
                        conversationCreated: { participants },
                    } = payload;

                    return userIsConversationParticipant(participants, userId);
                }
            ),
        },
    },
}

export const participantPopulated = Prisma.validator<Prisma.ConversationParticipantInclude>()({
    user: {
        select: {
            id: true,
            username: true,

        },
    }
})

export const conversationPopulated =
    Prisma.validator<Prisma.ConversationInclude>()({
        participants: {
            include: participantPopulated,
        },
        latestMessage: {
            include: {
                sender: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
        },
    });

export default resolvers;