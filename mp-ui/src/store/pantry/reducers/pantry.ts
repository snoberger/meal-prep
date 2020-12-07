import {
    EDIT_PANTRY_INGREDIENT,
    SET_PANTRY,
    TOGGLE_ADDDIALOGUE,
    TOGGLE_EDITDIALOGUE,
    TOGGLE_PANTRYERROR,
} from '../actionTypes';
import { State } from '../../rootReducer';

export type Ingredient = {
    index: number,
    name: string,
    amount: string,
    metric: string,
    id?: string
}

export type PantryObject = {
    id: string,
    userId: string,
    ingredients: Array<Ingredient>,
    createTs: string,
    updateTs: string
}
// if we are testing return a default initial state since this will go away when we hook to DB
type PantryState = {
    pantry: PantryObject,
    displayAddIngredientDiaglogue: boolean,
    displayEditIngredientDialogue: boolean,
    currentIngredient: Ingredient,
    alert: boolean
}
/* istanbul ignore next */
const initialState: PantryState = {
    // eslint-disable-next-line
    pantry: {
        id: '',
        userId: '',
        ingredients: [],
        createTs: '',
        updateTs: ''
    },
    currentIngredient: {index: -1, name: '', amount: '', metric: ''},
    displayAddIngredientDiaglogue: false,
    displayEditIngredientDialogue: false,
    alert: false,
};

const pantry = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_PANTRY:
            return {
                ...state,
                pantry: action.pantry
            };
        case TOGGLE_ADDDIALOGUE:
            return {
                ...state,
                displayAddIngredientDiaglogue: !state.displayAddIngredientDiaglogue,
            };
        case TOGGLE_EDITDIALOGUE:
            state.currentIngredient = action.ingredient;
            return {
                ...state,
                displayEditIngredientDialogue: !state.displayEditIngredientDialogue
            };
        case EDIT_PANTRY_INGREDIENT:
            return {
                ...state,
                pantry: {
                    ...state.pantry,
                    ingredients: action.ingredients
                }
            };
        case TOGGLE_PANTRYERROR:
            return {
                ...state,
                alert: true
            };
        
        default:
            return {...state};
    }
};
  
export const getIngredients = (state: State) => {
    return state.pantry.pantry.ingredients;
};

export const getPantryId = (state: State) => {
    return state.pantry.pantry.id;
};

export const getAddIngredientDialogueOpen = (state: State) => {
    return state.pantry.displayAddIngredientDiaglogue;
};

export const getEditIngredientDialogueOpen = (state: State) => {
    return state.pantry.displayEditIngredientDialogue;
};


 
 export default pantry;