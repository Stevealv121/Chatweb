import { Prisma, PrismaClient } from "@prisma/client";
import { PubSub } from "graphql-subscriptions";
import { Context } from "graphql-ws/lib/server";
import { ISODateString } from "next-auth";
import {
    conversationPopulated,
    participantPopulated,
} from "../graphql/resolvers/conversation";

//Server configurations

export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
    pubsub: PubSub;
}

export interface Session {
    user?: User;
    expires: ISODateString;
}

export interface SubscriptionContext extends Context {
    connectionParams: {
        session?: Session;
    };
}

//Users

export interface CreateUsernameResponse {
    success?: boolean;
    error?: string;
}

export interface User {
    id: string;
    username: string;
    email: string;
    image: string;
    name: string;
    emailVerified: boolean;
}

//Conversations
export type ConversationPopulated = Prisma.ConversationGetPayload<{
    include: typeof conversationPopulated;
}>;

export type ParticipantPopulated = Prisma.ConversationParticipantGetPayload<{
    include: typeof participantPopulated;
}>;

export interface ConversationCreatedSubscriptionPayload {
    conversationCreated: ConversationPopulated;
}

export interface ConversationUpdatedSubscriptionData {
    conversationUpdated: {
        conversation: ConversationPopulated;
        addedUserIds: Array<string>;
        removedUserIds: Array<string>;
    };
}

export interface ConversationDeletedSubscriptionPayload {
    conversationDeleted: ConversationPopulated;
}