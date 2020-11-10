import {

} from '../actionTypes';
import { State } from '../../rootReducer';

export type Recipes = {

}

export const getRecipes = (state: State) => {
    return state.recipes.recipes;
};