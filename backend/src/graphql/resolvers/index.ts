import merge from "lodash.merge";
// import conversationResolvers from "./conversations";
import messageResolvers from "./message";
// import scalarResolvers from "./scalars";
import userResolvers from "./user";
import conversationResolvers from "./conversation";

const resolvers = merge(
    {},
    userResolvers,
    // scalarResolvers,
    conversationResolvers,
    messageResolvers
);

export default resolvers;
