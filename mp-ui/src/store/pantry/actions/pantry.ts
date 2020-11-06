import { UPDATE_INGREDIENTS } from '../actionTypes';


export const updateIngredients = (ingredients: string) => {
  return {
    type: UPDATE_INGREDIENTS,
    ingredients
  };
};