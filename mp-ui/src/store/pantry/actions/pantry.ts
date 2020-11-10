import { createPantryIngredient, deletePantryIngredient } from '../../../api/pantry';
import {
  ADD_PANTRY_INGREDIENT, TOGGLE_ADDDIALOGUE, TOGGLE_PANTRYERROR, UPDATE_INGREDIENTS,
  DELETE_PANTRY_INGREDIENT, TOGGLE_DELETE_DISPLAY, TOGGLE_DELETE_ERROR
} from '../actionTypes';
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
    try {
      return await createPantryIngredient(ingredient).then((response: any) => {
        if (response.status === 200 && response.data.message) {

          return dispatch(createdPantryIngredient(ingredient));
        }
        return dispatch(createdPantryIngredientError());
      });
    } catch (e) {
      return dispatch(createdPantryIngredientError());
    }
  };

}

export const toggleAddIngredientDialogue = () => {
  return {
    type: TOGGLE_ADDDIALOGUE,
  };
};


export const deletedPantryIngredient = (ingredient: Ingredient) => {
  return {
    type: DELETE_PANTRY_INGREDIENT,
    ingredient: ingredient,
  };
};

export const deletedPantryIngredientError = () => {
  return {
    type: TOGGLE_DELETE_ERROR,
  };
};

export const toggleDeleteIngredientDisplay = () => {
  return {
    type: TOGGLE_DELETE_DISPLAY,
  };
};

export function handleDeleteIngredient(ingredient: Ingredient) {
  return async (dispatch: any) => {
    try {
      return await deletePantryIngredient(ingredient).then((response: any) => {
        if (response.status === 200 && response.data.message) {

          return dispatch(deletedPantryIngredient(ingredient));
        }
        return dispatch(deletedPantryIngredientError());
      });
    } catch (e) {
      return dispatch(deletedPantryIngredientError());
    }
  };

}