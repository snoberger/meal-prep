import { SET_DISPLAY_RECIPE, SET_RECIPE_LIST } from '../actionTypes';
import { State } from '../../rootReducer';
import { Ingredient } from '../../pantry/reducers/pantry';

export type Recipe = {
    id: string,
    name: string,
    description: string,
    ingredients: Array<Ingredient>,
    steps: Array<RecipeStep>
}

export type RecipeStep = {
    description: string,
    type: string,
    resources: string[],
    time: string,
    order: string
}

const initialState = {
    // eslint-disable-next-line
    recipeList: [],
    displayRecipe: {}
};

const recipes = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_RECIPE_LIST:
            return {
                ...state,
                recipeList: action.recipeList
            };
        case SET_DISPLAY_RECIPE:
            return {
                ...state,
                displayRecipe: action.recipe
            };
        default:
            return {...state};
    }
};

export const getRecipeList = (state: State) => {
    return state.recipes.recipeList;
};

export const getDisplayRecipe = (state: State): Recipe => {
    return state.recipes.displayRecipe;
};

export default recipes;