import {
    SET_INGREDIENTS,
} from '../actionTypes';
import { State } from '../../rootReducer';

export type Ingredient = {
    name: string,
    amount: string,
    metric: string
}
const initialState = {
    ingredients: [
        {
            name: 'flour',
            amount: '2',
            metric: 'bags'
        },
        {
            name: 'sugar',
            amount: '2',
            metric: 'cups'
        },
        {
            name: 'corn starch',
            amount: '16',
            metric: 'oz'
        },
        {
            name: 'milk',
            amount: '1',
            metric: 'gallon'
        }
    ],
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