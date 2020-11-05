import {
    SET_INGREDIENTS,
} from '../actionTypes';
import { State } from '../../rootReducer';

export type Ingredient = {
    name: string,
    amount: string,
    metric: string
}
const ingreds = [];
for(let i = 0; i < 4; i++){
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
const initialState = {
    ingredients: ingreds,
};

const pantry = (state = initialState, action: any) => {
    switch (action.type) {
        case SET_INGREDIENTS:
            return {
                ...state,
                ingredients: action.ingredients
            };
        default:
            return initialState;
    }
};
  
export const getIngredients = (state: State) => {
    return state.pantry.ingredients;
};
 
 export default pantry;