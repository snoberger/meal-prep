import { createPantryIngredient } from '../../../api/pantry';
import { ADD_PANTRY_INGREDIENT, TOGGLE_ADDDIALOGUE, TOGGLE_PANTRYERROR, UPDATE_INGREDIENTS } from '../actionTypes';
import { Ingredient } from '../reducers/pantry';



export const updateIngredients = () => {
  return {
    type: UPDATE_INGREDIENTS,
  };
};

export const createdPantryIngredient = (ingredient: Ingredient) => {
  return {
    type: ADD_PANTRY_INGREDIENT,
    ingredient: ingredient,
  };
};

export const createdPantryIngredientError = () => {
  return {
    type: TOGGLE_PANTRYERROR
  };
};


export function handleCreateIngredient(ingredient: Ingredient) {
  return async (dispatch: any) => {
    dispatch(updateIngredients());
    try{
      return await createPantryIngredient(ingredient).then((response: any) => {
        if(response.status === 200 && response.data.message) {
          
          return dispatch(createdPantryIngredient(ingredient));
        }
        return dispatch(createdPantryIngredientError());
      });
    } catch(e) {
      return dispatch(createdPantryIngredientError());
    }
  };
    
}

export const toggleAddIngredientDialogue = () => {
  return {
    type: TOGGLE_ADDDIALOGUE,
  };
};