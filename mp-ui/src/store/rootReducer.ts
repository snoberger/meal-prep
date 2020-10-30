import { combineReducers } from 'redux';
import auth from './auth/reducers/auth';
import user from './user/reducers/user';

export  interface State {
    auth: {
        authToken: string
    }
}

export default combineReducers({
  auth,
  user
});