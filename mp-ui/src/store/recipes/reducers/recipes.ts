import {

} from '../actionTypes';
import { State } from '../../rootReducer';
import { Ingredient } from '../../pantry/reducers/pantry';

export type Recipe = {
    ingredients: Array<Ingredient>
    step: Array<RecipeStep>
}

export type RecipeStep = {
    description: string
}

const initialState = {
    // eslint-disable-next-line
    recipeList: []
};

const recipes = (state = initialState, action: any) => {
    switch (action.type) {
        default:
            return {...state};
    }
};

export const getRecipeList = (state: State) => {
    return state.recipes.recipeList;
};

export default recipes