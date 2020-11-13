import { ADD_DISPLAY_INGREDIENT, ADD_DISPLAY_STEP, SET_COMPONENT_STATE, SET_COMPONENT_STATE_ADD, SET_DISPLAY_RECIPE, SET_RECIPE_LIST, TOGGLE_ADDDIALOGUE, TOGGLE_ADD_RECIPE_INGREDIENT_DIALOGUE, UPDATE_DISPLAY_DESCRIPTION, UPDATE_DISPLAY_NAME } from '../actionTypes';
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
    // eslint-disable-next-line
    displayRecipe: {
        id: '',
        name: '',
        description: '',
        ingredients: [],
        steps: []
    },
    componentState: '',
    addStepDialogue: false,
    addIngredientDialogue: false
};

const recipes = (state = initialState, action: any) => {
    console.log(action)
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
        case TOGGLE_ADDDIALOGUE:
            return {
                ...state,
                addStepDialogue: !state.addStepDialogue
            };
        case TOGGLE_ADD_RECIPE_INGREDIENT_DIALOGUE:
            return {
                ...state,
                addIngredientDialogue: !state.addIngredientDialogue
            };
        case SET_COMPONENT_STATE:
            return {
                ...state,
                componentState: action.componentState
            };
        case SET_COMPONENT_STATE_ADD:
            return {
                ...state,
                displayRecipe: {...initialState.displayRecipe},
                componentState: action.componentState
            };
        case UPDATE_DISPLAY_NAME:
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    name: action.name
                }
            };
        case UPDATE_DISPLAY_DESCRIPTION:
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    description: action.description
                }
            };
        case ADD_DISPLAY_INGREDIENT:
            let ingredients = (state.displayRecipe.ingredients as Ingredient[])
            ingredients.push(action.ingredient)
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    ingredients: ingredients.slice()
                }
            };
        case ADD_DISPLAY_STEP:
            let steps = (state.displayRecipe.steps as RecipeStep[])
            steps.push(action.step)
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    steps: steps.slice()
                }
            };
        default:
            return {...state};
    }
};

export const getRecipeList = (state: State) => {
    return state.recipes.recipeList;
};

export const getDisplayRecipe = (state: State): Recipe => {
    console.log(state.recipes.displayRecipe)
    return state.recipes.displayRecipe;
};

export const getAddRecipeStepDialogueOpen = (state: State): boolean => {
    return state.recipes.addStepDialogue;
};

export const getAddRecipeIngredientDialogue = (state: State): boolean => {
    return state.recipes.addIngredientDialogue;
};


export const getComponentState = (state: State): string => {
    return state.recipes.componentState;
};

export default recipes;