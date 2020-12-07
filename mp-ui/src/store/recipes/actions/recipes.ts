import { createRecipe, editRecipe, fetchRecipe, fetchRecipeList } from '../../../api/recipes';
import { generateGroceryList } from '../../../api/grocery';
import {FETCH_RECIPE_ERROR, FETCH_RECIPE_LIST_ERROR, SET_DISPLAY_RECIPE, SET_RECIPE_LIST, UPDATE_DISPLAY_DESCRIPTION, UPDATE_DISPLAY_NAME, ADD_DISPLAY_INGREDIENT, ADD_DISPLAY_STEP, TOGGLE_ADDDIALOGUE, SET_COMPONENT_STATE, SET_COMPONENT_STATE_ADD, TOGGLE_ADD_RECIPE_INGREDIENT_DIALOGUE, POST_RECIPE, POST_RECIPE_ERROR, REMOVE_INGREDIENT_AT_INDEX, REMOVE_STEP_AT_INDEX, UPDATE_CHECKED_LIST, GENERATE_GROCERY_LIST_ERROR, TOGGLE_GROCERY_DIALOG} from '../actionTypes';
import { CheckedRecipe, Recipe, RecipeStep } from '../reducers/recipes';

export const setDisplayRecipe = (recipe: Recipe) => {
  return {
    type: SET_DISPLAY_RECIPE,
    recipe
  };
};

export const editDisplayName = (name:string) => {
  return {
    type: UPDATE_DISPLAY_NAME,
    name
  };
};

export const editDisplayDescription = (description:string) => {
  return {
    type: UPDATE_DISPLAY_DESCRIPTION,
    description
  };
};

export const addIngredientDisplay = (name:string, amount: string, metric: string) => {
  return {
    type: ADD_DISPLAY_INGREDIENT,
    ingredient: {name, amount, metric}
  };
};

export const toggleAddRecipeStepDialogue = () => {
  return {
    type: TOGGLE_ADDDIALOGUE,
  };
};

export const toggleAddRecipeIngredientDialogue = () => {
  return {
    type: TOGGLE_ADD_RECIPE_INGREDIENT_DIALOGUE,
  };
};

export const setComponentState = (componentState: string) => {
  if(componentState === 'add'){
    return {
      type: SET_COMPONENT_STATE_ADD,
      componentState
    };
  }
  return {
    type: SET_COMPONENT_STATE,
    componentState
  };
};

export const addStepDisplay = (step: RecipeStep) => {
  return {
    type: ADD_DISPLAY_STEP,
    step
  };
};

export const removeIngredientAtIndex = (index: number) => {
  return {
    type: REMOVE_INGREDIENT_AT_INDEX,
    index
  };
};

export const removeStepAtIndex = (index: number) => {
  return {
    type: REMOVE_STEP_AT_INDEX,
    index
  };
};

export const setRecipeList = (recipeList: any) => {
  return {
    type: SET_RECIPE_LIST,
    recipeList
  };
};

export const toggleGroceryDialog = () => {
  return {
    type: TOGGLE_GROCERY_DIALOG,
  };
};


export const fetchRecipeListError = () => {
  return {
    type: FETCH_RECIPE_LIST_ERROR,
  };
};

export const generateGroceryListError = () => {
  return {
    type: GENERATE_GROCERY_LIST_ERROR,
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

export function handleFetchRecipeBatch(userId: string, recipeIds: string[]) {
  return async (dispatch: any) => {
    try{
      let promises = recipeIds.map(async (recipeId) => {
        return await fetchRecipe(userId, recipeId).then((response: any) => {
          if(response.status === 200 && response.data) {
            //todo cast and validate this
            return response.data;
          }
          return dispatch(fetchRecipeError());
        });
      });
      return dispatch(setRecipeList(await Promise.all(promises)));
    } catch(e) {
      return dispatch(fetchRecipeError());
    }
  };
}
export function handleGenereateGroceryList(recipeIds: Array<string>) {
  return async (dispatch: any) => {
    try{
      return await generateGroceryList(recipeIds).then((response: any) => {
        if(response.status === 200 && response.data) {
          return dispatch(toggleGroceryDialog());
        }
        return dispatch(generateGroceryListError());
      });
    } catch(e) {
      return dispatch(generateGroceryListError());
    }
  };
}

export const postedRecipe = () => {
  return {
    type: POST_RECIPE,
  };
};

export const postRecipeError = () => {
  return {
    type: POST_RECIPE_ERROR,
  };
};

export function handleCreateRecipe(recipe: Recipe) {
  return async (dispatch: any) => {
    try{
      return createRecipe(recipe).then((response: any) => {
        if(response.status === 201 && response.data.message) {
          //todo cast and validate this
          return dispatch(postedRecipe());
        }
        return dispatch(postRecipeError());
      });
    } catch(e) {
      return dispatch(postRecipeError());
    }
  };
}

export function handleEditRecipe(userId: string, recipe: Recipe) {
  return async (dispatch: any) => {
    try{
      if(!recipe.id){
        throw new Error('missing recipeId');
      }
      return await editRecipe(userId, recipe.id, recipe).then((response: any) => {
        if(response.status === 200 && response.data.message) {
          //todo cast and validate this
          return dispatch(postedRecipe());
        }
        return dispatch(postRecipeError());
      });
    } catch(e) {
      return dispatch(postRecipeError());
    }
  };
}

export const updateCheckedList = (checkedList: Array<CheckedRecipe>) => {
  return {
    type: UPDATE_CHECKED_LIST,
    checkedList
  };
};
