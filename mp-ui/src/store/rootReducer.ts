import { combineReducers } from 'redux';
import auth from './auth/reducers/auth';

export  interface State {
    auth: {
        authToken: string
    }
}

export default combineReducers({
  auth,
});