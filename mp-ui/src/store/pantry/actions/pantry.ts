import { createPantryIngredient, editPantryIngredientApi } from '../../../api/pantry';
import { ADD_PANTRY_INGREDIENT, TOGGLE_ADDDIALOGUE, TOGGLE_PANTRYERROR, UPDATE_INGREDIENTS, TOGGLE_EDITDIALOGUE, EDIT_PANTRY_INGREDIENT } from '../actionTypes';
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

export const editPantryIngredient = (ingredient: Ingredient) => {
  return {
    type: EDIT_PANTRY_INGREDIENT,
    ingredient: ingredient,
  };
};


export const createdPantryIngredientError = () => {
  return {
    type: TOGGLE_PANTRYERROR
  };
};

export const editPantryIngredientError = () => {
  return {
    type: TOGGLE_PANTRYERROR
  };
};


export function handleCreateIngredient(ingredient: Ingredient) {
  return async (dispatch: any) => {
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

export function handleEditIngredient(ingredient: Ingredient) {
  return async (dispatch: any) => {
    try{
      return await editPantryIngredientApi(ingredient).then((response: any) => {
        if(response.status === 200 && response.data.message) {
          
          return dispatch(editPantryIngredient(ingredient));
        }
        return dispatch(editPantryIngredientError());
      });
    } catch(e) {
      return dispatch(editPantryIngredientError());
    }
  };
}

export const toggleAddIngredientDialogue = () => {
  return {
    type: TOGGLE_ADDDIALOGUE,
  };
};

export const toggleEditIngredientDialogue = (ingredient: Ingredient) => {
  return {
    type: TOGGLE_EDITDIALOGUE,
    ingredient: ingredient
  };
};