import {
    ConversationPopulated, MessagePopulated,
} from "../../backend/src/util/types";
//User types
export interface ICreateUsernameData {
    createUsername: {
        success: boolean;
        error: string;
    }
}

export interface ICreateUsernameVariables {
    username: string;
}

export interface SearchUsersInput {
    username: string;
}

export interface SearchedUser { id: string, username: string }

export interface SearchUsersData {
    searchUsers: Array<SearchedUser>
}

//Conversation types
export interface CreateConversationData {
    createConversation: {
        conversationId: string;
    }
}
export interface CreateConversationInput {
    participantsIds: Array<string>;
}
export interface ConversationsData {
    conversations: Array<ConversationPopulated>
}

export interface ConversationCreatedSubscriptionData {
    subscriptionData: {
        data: {
            conversationCreated: ConversationPopulated;
        };
    };
}

//Message types

export interface MessagesData {
    messages: Array<MessagePopulated>;
}

export interface MessageVariables {
    conversationId: string;
}

export interface MessagesSubscriptionData {
    subscriptionData: {
        data: {
            messageSent: MessagePopulated;
        };
    };
}
