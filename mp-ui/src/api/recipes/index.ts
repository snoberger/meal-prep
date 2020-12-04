import {ENDPOINT} from '../const';
import axios from 'axios';
import { getConfig } from '../middleware';
import { FetchRecipeListResponse, PostRecipeListResponse } from './types';
import { Recipe } from '../../store/recipes/reducers/recipes';
export * from './types';

export const RECIPE_ENDPOINT = `${ENDPOINT()}/recipe/`;

export async function fetchRecipeList(userId: string): Promise<FetchRecipeListResponse> {
    return await axios.get(RECIPE_ENDPOINT + `${userId}`, getConfig());
}

export async function fetchRecipe(userId: string, recipeId: string): Promise<FetchRecipeListResponse> {
    return await axios.get(RECIPE_ENDPOINT + `${userId}/${recipeId}`, getConfig());
}
export async function editRecipe(userId: string, recipeId: string, recipe: Recipe): Promise<PostRecipeListResponse> {
    return await axios.put(RECIPE_ENDPOINT + `${userId}/${recipeId}`, recipe, getConfig());
}
export async function createRecipe(recipe: Recipe): Promise<PostRecipeListResponse> {
    return await axios.post(RECIPE_ENDPOINT, recipe, getConfig());
}