import {
    ADD_PANTRY_INGREDIENT,
    EDIT_PANTRY_INGREDIENT,
    TOGGLE_ADDDIALOGUE,
    TOGGLE_EDITDIALOGUE,
    TOGGLE_PANTRYERROR,
    UPDATE_INGREDIENTS,
} from '../actionTypes';
import { State } from '../../rootReducer';

export type Ingredient = {
    name: string,
    amount: string,
    metric: string
}

const ingreds = [];
for(let i = 0; i < 1; i++){
    ingreds.push({
        name: 'flour',
        amount: '2',
        metric: 'bags'
    });
    ingreds.push({
        name: 'sugar',
        amount: '2',
        metric: 'cups'
    });
    ingreds.push({
        name: 'Corn Starch',
        amount: '16',
        metric: 'oz'
    });
    ingreds.push({
        name: 'milk',
        amount: '1',
        metric: 'gallon'
    });
}
// if we are testing return a default initial state since this will go away when we hook to DB

/* istanbul ignore next */
const initialState = {
    // eslint-disable-next-line
    ingredients: process.env.NODE_ENV === 'test' ? [] : ingreds,
    currentIngredient: {name: '', amount: '', metric: ''},
    displayAddIngredientDiaglogue: false,
    displayEditIngredientDialogue: false,
    alert: false,
};

const pantry = (state = initialState, action: any) => {
    let ingredients;
    switch (action.type) {
        case UPDATE_INGREDIENTS:
            return {
                ...state
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
        case ADD_PANTRY_INGREDIENT:
            ingredients = state.ingredients;
            ingredients.push(action.ingredient);
            return {
                ...state,
                ingredients: ingredients
            };
        case EDIT_PANTRY_INGREDIENT:
            ingredients = state.ingredients;
            ingredients.forEach(i => {
                if(i.name === action.ingredient.name) {
                    i.amount = action.ingredient.amount;
                    i.metric = action.ingredient.metric;
                }
            });
            
            return {
                ...state,
                ingredients: ingredients
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
    return state.pantry.ingredients;
};

export const getAddIngredientDialogueOpen = (state: State) => {
    return state.pantry.displayAddIngredientDiaglogue;
};

export const getEditIngredientDialogueOpen = (state: State) => {
    return state.pantry.displayEditIngredientDialogue;
};


 
 export default pantry;