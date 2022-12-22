/* eslint-disable import/no-anonymous-default-export */
import { gql } from '@apollo/client';

export const conversationFields = `
    id
    participants{
        user{
            id
            username
        }
        hasSeenLatestMessage
    }
    latestMessage{
        id
        sender{
            id
            username
        }
        body
        createdAt
    }
    updatedAt
`;

export default {
    Queries: {
        conversations: gql`
            query Conversations {
                conversations{
                    ${conversationFields}
                }
            }
        `,
    },
    Mutations: {
        createConversation: gql`
            mutation CreateConversation($participantsIds:[String]!) {
                createConversation(participantsIds:$participantsIds){
                    conversationId
                }
            }
        `,
    },
    Subscriptions: {
        conversationCreated: gql`
            subscription ConversationCreated {
                conversationCreated{
                    ${conversationFields}
                }
            }
        `,
    },
};