import { Prisma } from "@prisma/client";
import { GraphQLError } from "graphql";
import { withFilter } from "graphql-subscriptions";
import { userIsConversationParticipant } from "../../util/functions";
import { GraphQLContext, MessagePopulated, MessageSentSubscriptionPayload, SendMessagesArguments } from "../../util/types";
import { conversationPopulated } from "./conversation";

const resolvers = {
    Query: {
        messages: async function (
            _: any,
            args: { conversationId: string },
            context: GraphQLContext
        ): Promise<Array<MessagePopulated>> {
            const { session, prisma } = context;
            const { conversationId } = args;

            if (!session?.user) {
                throw new GraphQLError("Not authorized")
            }

            const { id: userId } = session.user;

            try {
                const conversation = await prisma.conversation.findUnique({
                    where: {
                        id: conversationId
                    },
                    include: conversationPopulated
                })

                if (!conversation) {
                    throw new GraphQLError("Conversation not found")
                }

                const isParticipant = userIsConversationParticipant(conversation.participants, userId)

                if (!isParticipant) {
                    throw new GraphQLError("Not authorized")
                }

                const messages = await prisma.message.findMany({
                    where: {
                        conversationId
                    },
                    include: messagePopulated,
                    orderBy: {
                        createdAt: "desc"
                    }
                })

                return messages
            } catch (error: any) {
                throw new GraphQLError(error?.message)
            }
        }
    },
    Mutation: {
        sendMessage: async function (
            _: any,
            args: SendMessagesArguments,
            context: GraphQLContext
        ): Promise<boolean> {
            const { session, prisma, pubsub } = context;

            const { id: messageId, senderId, conversationId, body } = args;

            if (!session?.user) {
                throw new GraphQLError("Not authorized")
            }

            const { id: userId } = session.user;

            if (userId !== senderId) {
                throw new GraphQLError("Not authorized")
            }

            try {
                const newMessage = await prisma.message.create({
                    data: {
                        id: messageId,
                        senderId,
                        conversationId,
                        body,
                    },
                    include: messagePopulated
                })

                /**
        * Could cache this in production
        */
                const participant = await prisma.conversationParticipant.findFirst({
                    where: {
                        userId,
                        conversationId,
                    },
                });

                /**
        * Should always exist
        */
                if (!participant) {
                    throw new GraphQLError("Participant does not exist");
                }


                const conversation = await prisma.conversation.update({
                    where: {
                        id: conversationId
                    },
                    data: {
                        latestMessageId: newMessage.id,
                        participants: {
                            update: {
                                where: {
                                    id: participant.id
                                },
                                data: {
                                    hasSeenLatestMessage: true
                                }
                            },
                            updateMany: {
                                where: {
                                    NOT: {
                                        userId,
                                    }
                                },
                                data: {
                                    hasSeenLatestMessage: false
                                }
                            }

                        }
                    },
                    include: conversationPopulated,
                })
                pubsub.publish("MESSAGE_SENT", { messageSent: newMessage })
                //pubsub.publish("CONVERSATION_UPDATED", { conversationUpdated: conversation })
            } catch (error: any) {
                console.log("send message error", error)
                throw new GraphQLError(error?.message)
            }

            return true
        }
    },
    Subscription: {
        messageSent: {
            subscribe: withFilter(
                (_: any, __: any, context: GraphQLContext) => {
                    const { pubsub } = context;
                    return pubsub.asyncIterator(["MESSAGE_SENT"])
                },
                (
                    payload: MessageSentSubscriptionPayload,
                    args: { conversationId: string },
                    context: GraphQLContext
                ) => {
                    return payload.messageSent.conversationId === args.conversationId
                }
            )
        }

    },
}
export const messagePopulated = Prisma.validator<Prisma.MessageInclude>()({
    sender: {
        select: {
            id: true,
            username: true,
        },
    },
});
export default resolvers