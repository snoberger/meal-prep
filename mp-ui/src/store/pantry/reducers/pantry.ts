import {
    ADD_PANTRY_INGREDIENT,
    EDIT_PANTRY_INGREDIENT,
    SET_PANTRY,
    TOGGLE_ADDDIALOGUE,
    TOGGLE_EDITDIALOGUE,
    TOGGLE_PANTRYERROR,
} from '../actionTypes';
import { State } from '../../rootReducer';

export type Ingredient = {
    name: string,
    amount: string,
    metric: string
}

export type PantryObject = {
    id: string,
    userId: string,
    ingredients: Array<Ingredient>,
    createTs: string,
    updateTs: string
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
    currentIngredient: {name: '', amount: '', metric: ''},
    displayAddIngredientDiaglogue: false,
    displayEditIngredientDialogue: false,
    alert: false,
};

const pantry = (state = initialState, action: any) => {
    let ingredients;
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
        case ADD_PANTRY_INGREDIENT:
            ingredients = state.pantry.ingredients;
            ingredients.push(action.ingredient);
            return {
                ...state,
                ingredients: ingredients
            };
        case EDIT_PANTRY_INGREDIENT:
            ingredients = state.pantry.ingredients;
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