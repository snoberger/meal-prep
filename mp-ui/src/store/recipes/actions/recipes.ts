import { fetchRecipe, fetchRecipeList } from '../../../api/recipes';
import {FETCH_RECIPE_ERROR, FETCH_RECIPE_LIST_ERROR, SET_DISPLAY_RECIPE, SET_RECIPE_LIST} from '../actionTypes';
import { Recipe } from '../reducers/recipes';

export const setDisplayRecipe = (recipe: Recipe) => {
  return {
    type: SET_DISPLAY_RECIPE,
    recipe
  };
};

export const setRecipeList = (recipeList: any) => {
  return {
    type: SET_RECIPE_LIST,
    recipeList
  };
};

export const fetchRecipeListError = () => {
  return {
    type: FETCH_RECIPE_LIST_ERROR,
  };
};

export const fetchRecipeError = () => {
  return {
    type: FETCH_RECIPE_ERROR,
  };
};


export function handleFetchRecipeList(userId: string) {
  return async (dispatch: any) => {
    try{
      return await fetchRecipeList(userId).then((response: any) => {
        if(response.status === 200 && response.data) {
          //todo cast and validate this
          return dispatch(setRecipeList(response.data));
        }
        return dispatch(fetchRecipeListError());
      });
    } catch(e) {
      return dispatch(fetchRecipeListError());
    }
  };
}

export function handleFetchRecipe(userId: string, recipeId: string) {
  return async (dispatch: any) => {
    try{
      return await fetchRecipe(userId, recipeId).then((response: any) => {
        if(response.status === 200 && response.data) {
          //todo cast and validate this
          return dispatch(setDisplayRecipe(response.data));
        }
        return dispatch(fetchRecipeError());
      });
    } catch(e) {
      return dispatch(fetchRecipeError());
    }
  };
    
}