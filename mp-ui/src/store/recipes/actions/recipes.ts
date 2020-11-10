import { UPDATE_RECIPES } from '../actionTypes';

export const updateRecipes = (recipes: string) => {
    return {
      type: UPDATE_RECIPES,
      recipes
    };
  };
