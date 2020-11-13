import {
    SET_AUTH,
    REQUEST_AUTH_TOKEN,
    INVALID_LOGIN_CRED,
    INVALID_TOKEN
} from '../actionTypes';
import { State } from '../../rootReducer';

const initialState = {
    authToken: '',
    userId: '',
    pantryId: '',
    alert: undefined
};

const auth = (state = initialState, action: any) => {
    
    switch (action.type) {
        case SET_AUTH:
            return {
                ...state,
                authToken: action.authToken,
                userId: action.userId,
                pantryId: action.pantryId,
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

export const getUserId = (state: State) => {
    return state.auth.userId;
};

export const getPantryId = (state: State) => {
    return state.auth.pantryId;
};

export const getAuthAlert = (state: State) => {
    return state.auth.alert;
};
export default auth;