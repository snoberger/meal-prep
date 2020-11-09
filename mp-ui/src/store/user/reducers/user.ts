import {
    SEND_SIGNUP, 
    CREATED_USER, 
    SIGNUP_ERROR
} from '../actionTypes';

const initialState = {
    signUpDetails: {},
    alert: false
};

const user = (state = initialState, action: any) => {
    switch (action.type) {
        case CREATED_USER:
            return {
                ...state,
            };
        case SEND_SIGNUP:
            return {
                ...state,
                signUpDetails: action.signUpDetails
            };
        case SIGNUP_ERROR:
            return {
                ...state,
                alert: true
            };
        default:
            return {...state};
    }
};
  
 export default user;