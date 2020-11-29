import { combineReducers } from 'redux';
import { CreateUserItem } from '../api';
import auth from './auth/reducers/auth';
import user from './user/reducers/user';
import recipes from './recipes/reducers/recipes';
import calendar from './calendar/reducers/calendar';
import pantry, { Ingredient, PantryObject } from './pantry/reducers/pantry';
import { InfoMessage } from '../Components/InfoComponent/InfoComponent';
import { Recipe } from './recipes/reducers/recipes';
import { CalendarEntry } from './calendar/reducers/calendar';

export  interface State {
    auth: {
      authToken: string,
      userId: string,
      pantryId: string,
      alert?: InfoMessage
    },
    pantry: {
      pantry: PantryObject,
      displayAddIngredientDiaglogue: boolean,
      displayEditIngredientDialogue: boolean,
      currentIngredient: Ingredient
    },
    user: {
      signUpDetails: CreateUserItem,
      alert: boolean
    },
    recipes: {
      recipeList: Array<Recipe>,
      displayRecipe: Recipe,
      addStepDialogue: boolean,
      addIngredientDialogue: boolean,
      componentState: string
    },
    calendar: {
      calendarEntryList: Array<CalendarEntry>,
      calendarEntry: CalendarEntry,
      displayAddcalendarEntryDialogue: boolean,
      displayEditcalendarEntryDialogue: boolean,
      componentState: string
    }
}

export default combineReducers({
  auth,
  user,
  pantry,
  recipes,
  calendar
});