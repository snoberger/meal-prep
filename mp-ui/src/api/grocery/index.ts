import {ENDPOINT} from '../const';
import axios from 'axios';
import { getConfig } from '../middleware';
import { GenerateGroceryListResponse } from './types';
export * from './types';

export const RECIPE_ENDPOINT = `${ENDPOINT()}/grocery-list`;


export async function generateGroceryList(recipeIds: Array<string>): Promise<GenerateGroceryListResponse> {
    return await axios.post(RECIPE_ENDPOINT, {recipes: recipeIds}, getConfig());
}

