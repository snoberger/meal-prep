import {ENDPOINT} from '../const';
import { getConfig } from '../middleware';
import axios from 'axios';
import { AuthenticateItem, AuthenticateResponse } from './types';
export * from './types';

export const AUTH_ENDPOINT = `${ENDPOINT()}/auth`;

//@ts-ignore
export async function loginUser(user: AuthenticateItem): Promise<AuthenticateResponse> {
    try {
        return await axios.post(AUTH_ENDPOINT, JSON.stringify( user));
    }
    catch(error) {
        return error.response;
    }
}

//@ts-ignore
export async function checkAuthToken(): Promise<AuthenticateResponse> {
    try {
        return await axios.get(AUTH_ENDPOINT, getConfig());
    }
    catch(error) {
        return error.response;
    }
}