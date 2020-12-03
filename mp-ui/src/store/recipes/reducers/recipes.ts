import { ADD_DISPLAY_INGREDIENT, ADD_DISPLAY_STEP, REMOVE_INGREDIENT_AT_INDEX, REMOVE_STEP_AT_INDEX, SET_COMPONENT_STATE, SET_COMPONENT_STATE_ADD, SET_DISPLAY_RECIPE, SET_RECIPE_LIST, TOGGLE_ADDDIALOGUE, TOGGLE_ADD_RECIPE_INGREDIENT_DIALOGUE, UPDATE_CHECKED_LIST, UPDATE_DISPLAY_DESCRIPTION, UPDATE_DISPLAY_NAME, REMOVE_RECIPE_AT_INDEX } from '../actionTypes';
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

export type CheckedRecipe = {
    id: string,
    checked: boolean
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
    addIngredientDialogue: false,
    checkedList: [],
};

const recipes = (state = initialState, action: any) => {
    let ingredients: Ingredient[];
    let steps: RecipeStep[];
    let recipeList: Recipe[];
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
                displayRecipe: { ...initialState.displayRecipe },
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
            ingredients = state.displayRecipe.ingredients;
            ingredients.push(action.ingredient);
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    ingredients: ingredients.slice()
                }
            };
        case REMOVE_INGREDIENT_AT_INDEX:
            ingredients = state.displayRecipe.ingredients;
            ingredients.splice(action.index, 1);
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    ingredients: ingredients.slice()
                }
            };
        case ADD_DISPLAY_STEP:
            steps = state.displayRecipe.steps;
            steps.push(action.step);
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    steps: steps.slice()
                }
            };
        case REMOVE_STEP_AT_INDEX:
            steps = state.displayRecipe.steps;
            steps.splice(action.index, 1);
            steps.forEach((step: any, index: number) => {
                step.order = index;
            });
            return {
                ...state,
                displayRecipe: {
                    ...state.displayRecipe,
                    steps: steps.slice()
                }
            };
        case REMOVE_RECIPE_AT_INDEX:
            recipeList = state.recipeList;
            recipeList.splice(action.index, 1);
            return {
                ...state,
            };
        case UPDATE_CHECKED_LIST:
            return {
                ...state,
                checkedList: action.checkedList,
            };
        default:
            return { ...state };
    }
};

export const getRecipeList = (state: State) => {
    return state.recipes.recipeList;
};

export const getDisplayRecipe = (state: State): Recipe => {
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

export const getCheckedList = (state: State): Array<CheckedRecipe> => {
    return state.recipes.checkedList;
};

export default recipes;