import { Ingredient } from "../../store/pantry/reducers/pantry";
import {ENDPOINT} from '../const';
import axios from 'axios';
import { getConfig } from '../middleware';
import { FetchPantryResponse } from './types';
export * from './types';

export const PANTRY_ENDPOINT = `${ENDPOINT}/pantry/`;

export async function fetchPantry(userId: string, pantryId: string): Promise<FetchPantryResponse> {
    return await axios.get(PANTRY_ENDPOINT + `${userId}/${pantryId}`, getConfig());
}

/* eslint-disable */
//@ts-ignore
export async function createPantryIngredient(ingredient: Ingredient): Promise {
    try {
        return await axios.post(PANTRY_ENDPOINT, JSON.stringify({ingredients: [ingredient]}), getConfig());
    }
    catch(error) {  
        return error.response;
    }
}
/* eslint-disable */
//@ts-ignore
export async function editPantryIngredientApi(ingredient: Ingredient): Promise {
    return new Promise((resolve,reject) => {
        resolve(
            {
                status: 200,
                data: {
                    message: "success"
            }
        });
    });
}