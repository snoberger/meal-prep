import { combineReducers } from 'redux';
import { CreateUserItem } from '../api';
import auth from './auth/reducers/auth';
import user from './user/reducers/user';
import pantry, { Ingredient } from './pantry/reducers/pantry';
import { InfoMessage } from '../Components/InfoComponent/InfoComponent';

export interface State {
  auth: {
    authToken: string,
    alert?: InfoMessage
  },
  pantry: {
    ingredients: Array<Ingredient>,
    displayAddIngredientDiaglogue: boolean,
    displayDeleteIngredientView: boolean,
  },
  user: {
    signUpDetails: CreateUserItem,
    alert: boolean
  }
}

export default combineReducers({
  auth,
  user,
  pantry
});