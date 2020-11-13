import {ENDPOINT} from '../const';
import axios from 'axios';
import { getConfig } from '../middleware';
import { FetchRecipeListResponse } from './types';
export * from './types';

export const RECIPE_ENDPOINT = `${ENDPOINT}/recipe/`;

export async function fetchRecipeList(userId: string): Promise<FetchRecipeListResponse> {
    return await axios.get(RECIPE_ENDPOINT + `${userId}`, getConfig());
}

export async function fetchRecipe(userId: string, recipeId: string): Promise<FetchRecipeListResponse> {
    return await axios.get(RECIPE_ENDPOINT + `${userId}/${recipeId}`, getConfig());
}