import {ENDPOINT} from '../const';
import axios from 'axios';
import { CreateUserItem, CreateUserResponse } from './types';
export * from './types';

export const USER_ENDPOINT = `${ENDPOINT()}/user`;

export async function createUser(user: CreateUserItem): Promise<CreateUserResponse> {
    return await axios.post(USER_ENDPOINT, JSON.stringify(user));
}