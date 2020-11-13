import { editPantry, fetchPantry, deletePantryIngredient } from '../../../api/pantry';
import {
  TOGGLE_ADDDIALOGUE, TOGGLE_PANTRYERROR, TOGGLE_EDITDIALOGUE, EDIT_PANTRY_INGREDIENT, SET_PANTRY, FETCH_PANTRY_ERROR,
  DELETE_PANTRY_INGREDIENT, TOGGLE_DELETE_DISPLAY, TOGGLE_DELETE_ERROR
} from '../actionTypes';
import { Ingredient, PantryObject } from '../reducers/pantry';

export const editedPantryIngredients = (ingredients: Ingredient[]) => {
  return {
    type: EDIT_PANTRY_INGREDIENT,
    ingredients: ingredients,
  };
};

export const editPantryIngredientsError = () => {
  return {
    type: TOGGLE_PANTRYERROR
  };
};

export const fetchPantryError = () => {
  return {
    type: FETCH_PANTRY_ERROR
  };
};

export const setPantry = (pantry: PantryObject) => {
  return {
    type: SET_PANTRY,
    pantry
  };
};

export function handleFetchPantry(userId: string, pantryId: string) {
  return async (dispatch: any) => {
    try {
      return await fetchPantry(userId, pantryId).then((response: any) => {
        if (response.status === 200 && response.data) {
          let indexedArray = response.data.ingredients.map((ingredient: any, index: number) => {
            return {
              name: ingredient.name,
              amount: ingredient.amount,
              metric: ingredient.metric,
              index: index
            };
          });
          response.data.ingredients = indexedArray;
          return dispatch(setPantry(response.data));
        }
        return dispatch(fetchPantryError());
      });
    } catch (e) {
      return dispatch(fetchPantryError());
    }
  };
}

export function handleEditPantry(userId: string, pantryId: string, ingredients: Ingredient[], ingredient: Ingredient) {
  return async (dispatch: any) => {
    try {
      ingredients[ingredient.index] = ingredient;
      const unindexedIngredients = ingredients.map((ingred: Ingredient) => {
        return {
          name: ingred.name,
          amount: ingred.amount,
          metric: ingred.metric
        };
      });
      return await editPantry(userId, pantryId, unindexedIngredients).then((response: any) => {
        if (response.status === 200) {
          return dispatch(editedPantryIngredients(ingredients));
        }
        return dispatch(editPantryIngredientsError());
      });
    } catch (e) {
      return dispatch(editPantryIngredientsError());
    }
  };
}

export function handleCreatePantry(userId: string, pantryId: string, ingredients: Ingredient[]) {
  return async (dispatch: any) => {
    try {
      return await editPantry(userId, pantryId, ingredients).then((response: any) => {
        if (response.status === 200) {
          return dispatch(editedPantryIngredients(ingredients));
        }
        return dispatch(editPantryIngredientsError());
      });
    } catch (e) {
      return dispatch(editPantryIngredientsError());
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

export function handleDeleteIngredient(userId: string, pantryId: string, ingredients: Ingredient[], ingredient: Ingredient) {
  return async (dispatch: any) => {
    try {
      ingredients[ingredient.index] = ingredient;
      const unindexedIngredients = ingredients.map((ingred: Ingredient) => {
        return {
          name: ingred.name,
          amount: ingred.amount,
          metric: ingred.metric
        };
      });
      return await deletePantryIngredient(userId, pantryId, unindexedIngredients).then((response: any) => {
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
