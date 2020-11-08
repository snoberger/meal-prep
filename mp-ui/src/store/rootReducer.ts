import { combineReducers } from 'redux';
import { CreateUserItem } from '../api';
import auth from './auth/reducers/auth';
import user from './user/reducers/user';
import pantry, { Ingredient } from './pantry/reducers/pantry';

export  interface State {
    auth: {
      authToken: string
    },
    pantry: {
      ingredients: Array<Ingredient>,
      displayAddIngredientDiaglogue: boolean
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