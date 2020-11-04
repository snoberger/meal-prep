import { SET_INGREDIENTS } from '../actionTypes';


export const setIngredients = (ingredients: string) => {
  return {
    type: SET_INGREDIENTS,
    ingredients
  };
};