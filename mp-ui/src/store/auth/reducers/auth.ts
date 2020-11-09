import {
    SET_AUTH_TOKEN,
    REQUEST_AUTH_TOKEN,
    INVALID_LOGIN_CRED,
    INVALID_TOKEN
} from '../actionTypes';
import { State } from '../../rootReducer';

const initialState = {
    authToken: '',
    alert: undefined
};

const auth = (state = initialState, action: any) => {
    
    switch (action.type) {
        case SET_AUTH_TOKEN:
            return {
                ...state,
                authToken: action.authToken,
                alert: undefined
            };
        case REQUEST_AUTH_TOKEN:
            return {
                ...state,
                loginDetails: action.loginDetails
            };
        case INVALID_LOGIN_CRED:
        case INVALID_TOKEN:
            return {
                ...state,
                authToken: "",
                alert: action.alert
            };
        default:
            return {...state};
    }
};
  
export const getAuthToken = (state: State) => {
    return state.auth.authToken;
};

export const getAuthAlert = (state: State) => {
    return state.auth.alert;
};
export default auth;