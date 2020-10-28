import { AuthenticateItem, loginUser } from '../../../api';
import { SET_AUTH_TOKEN, REQUEST_AUTH_TOKEN, INVALID_LOGIN_CRED } from '../actionTypes';


export const setAuthToken = (authToken: string) => {
  return {
    type: SET_AUTH_TOKEN,
    authToken
  };
};
export function invalidLoginCredentials(loginDetails: AuthenticateItem) {
  return {
    type: INVALID_LOGIN_CRED,
    loginDetails
  }
}
function requestAuthToken(loginDetails: AuthenticateItem) {
  return {
    type: REQUEST_AUTH_TOKEN,
    loginDetails
  }
}

export function fetchLogin(loginDetails: AuthenticateItem) {
  return async (dispatch: any) => {
    dispatch(requestAuthToken(loginDetails))
    return await loginUser(loginDetails).then((response) => {
      if(response.status === 200) {
        return dispatch(setAuthToken(response.data.message))
      }
      return dispatch(invalidLoginCredentials(loginDetails))

    }).catch((error) => {
        return dispatch(invalidLoginCredentials(loginDetails))
    })
  }
}