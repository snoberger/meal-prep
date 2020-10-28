import {
    SET_AUTH_TOKEN,
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
        default:
            return initialState;
    }
};
  
export const getAuthToken = (state: State) => {
    return state.auth.authToken;
};
 
 export default auth;