import gql from "graphql-tag";

const typeDefs = gql`
    type Mutation {
        createConversation(participantsIds:[String]):
        CreateConversationResponse
    }
    type CreateConversationResponse{
        conversationId: String
    }
    type Conversation {
        id: String
        latestMessage: Message
        participants: [Participant]
        updatedAt: Date
    }
    type Participant {
        id: String
        user: User
        hasSeenLatestMessage: Boolean
    }
    type Query {
        conversations:[Conversation]
    }
`;

export default typeDefs;