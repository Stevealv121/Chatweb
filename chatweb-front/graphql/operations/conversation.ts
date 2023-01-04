/* eslint-disable import/no-anonymous-default-export */
import { gql } from '@apollo/client';
import { MessageFields } from './message';

const ConversationFields = `
  id
  updatedAt
  participants {
    user {
      id
      username
    }
    hasSeenLatestMessage
  }
  latestMessage {
    ${MessageFields}
  }
`;

export default {
    Queries: {
        conversations: gql`
            query Conversations {
                conversations{
                    ${ConversationFields}
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
                    ${ConversationFields}
                }
            }
        `,
    },
};