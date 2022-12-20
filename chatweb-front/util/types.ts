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