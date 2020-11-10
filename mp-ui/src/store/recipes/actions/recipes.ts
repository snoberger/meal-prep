import { fetchRecipeList } from '../../../api/recipes';
import {FETCH_RECIPE_LIST_ERROR, SET_DISPLAY_RECIPE, SET_RECIPE_LIST} from '../actionTypes';

export const setDisplayRecipe = (recipeID: string) => {
  return {
    type: SET_DISPLAY_RECIPE,
    recipeID
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