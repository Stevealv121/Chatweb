import { PrismaClient } from "@prisma/client";
import { ISODateString } from "next-auth";

export interface GraphQLContext {
    session: Session | null;
    prisma: PrismaClient;
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

export interface Session {
    user?: User;
    expires: ISODateString;
}