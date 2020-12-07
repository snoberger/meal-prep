import {ENDPOINT} from '../const';
import axios from 'axios';
import { getConfig } from '../middleware';
import { FetchPantryResponse, unIndexedIngredient } from './types';
export * from './types';

export const PANTRY_ENDPOINT = `${ENDPOINT()}/pantry/`;

export async function fetchPantry(userId: string, pantryId: string): Promise<FetchPantryResponse> {
    return await axios.get(PANTRY_ENDPOINT + `${userId}/${pantryId}`, getConfig());
}

export async function editPantry(userId: string, pantryId: string, ingredients: unIndexedIngredient[]): Promise<FetchPantryResponse> {
    return await axios.put(PANTRY_ENDPOINT + `${userId}/${pantryId}`, JSON.stringify({ingredients: ingredients}), getConfig());
}