import {
    SET_AUTH_TOKEN,
    REQUEST_AUTH_TOKEN,
    INVALID_LOGIN_CRED
} from '../actionTypes';
import { State } from '../../rootReducer';
const initialState = {
    authToken: '',
};

const auth = (state = initialState, action: any) => {
    
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.authToken
            };
        case REQUEST_AUTH_TOKEN:
            return {
                ...state,
                loginDetails: action.loginDetails
            };
        case INVALID_LOGIN_CRED:
            return {
                ...state,
                alert: true
            };
        default:
            return {...state};
    }
};
  
export const getAuthToken = (state: State) => {
    return state.auth.authToken;
};
 
 export default auth;