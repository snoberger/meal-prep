import { createUser, CreateUserItem, CreateUserResponse } from '../../../api';
import { SEND_SIGNUP, SIGNUP_ERROR, CREATED_USER} from '../actionTypes';


export function signUpError() {
  return {
    type: SIGNUP_ERROR,
  };
}
function signUpUser(signUpDetails: CreateUserItem) {
  return {
    type: SEND_SIGNUP,
    signUpDetails
  };
}
function createdUser() {
    return {
      type: CREATED_USER,
    };
  }
export function fetchSignUp(signUpDetails: CreateUserItem) {
  return async (dispatch: any) => {
    dispatch(signUpUser(signUpDetails));
    try{
      return await createUser(signUpDetails).then((response: CreateUserResponse) => {
        if(response.status === 200 && response.data.message) {
          return dispatch(createdUser());
        }
        return dispatch(signUpError());
      });
    } catch(e) {
      return dispatch(signUpError());
    }
    
  };
}
