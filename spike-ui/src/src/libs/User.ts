import axios from 'axios';
import { ENDPOINT } from './consts';

export interface UserItem {
    user: string,
    pass: string,
    email: string
}

export interface AuthenticateItem {
    user: string,
    pass: string
}

export interface AuthenticateResponse {
    config: {},
    data: string | false,
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export interface UserItemResult extends UserItem {
    userId: string,
    updateTs: string,
    createTs: string
}

export interface UserResponse {
    config: {},
    data: UserItemResult,
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export const USER_ENDPOINT = `${ENDPOINT}/user`;
export const AUTH_ENDPOINT = `${ENDPOINT}/auth`;

export const create = async (user: UserItem): Promise<UserResponse> => {
    return await axios.post(USER_ENDPOINT, user);
}

export const authenticate = async(user: AuthenticateItem): Promise<string|false> => {
    return await axios.post(AUTH_ENDPOINT, user);
}