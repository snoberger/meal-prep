import {ENDPOINT} from '../const';
import axios from 'axios'; 
import { Ingredient } from "../../store/pantry/reducers/pantry";
import { getConfig } from '../middleware';

export const RECIPE_ENDPOINT = `${ENDPOINT}/pantry`;

/* eslint-disable */
//@ts-ignore
export async function createPantryIngredient(ingredient: Ingredient): Promise {
    console.log(typeof ingredient.amount);
    try {
        return await axios.post(RECIPE_ENDPOINT, JSON.stringify({ingredients: [ingredient]}), getConfig());
    }
    catch(error) {  
        return error.response;
    }
}