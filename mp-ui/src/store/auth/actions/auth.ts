import { AuthenticateItem, loginUser } from '../../../api';
import { InfoMessage } from '../../../Components/InfoComponent/InfoComponent';
import { SET_AUTH_TOKEN, REQUEST_AUTH_TOKEN, INVALID_LOGIN_CRED } from '../actionTypes';


export const setAuthToken = (authToken: string) => {
  return {
    type: SET_AUTH_TOKEN,
    authToken: authToken,
  };
};

export function invalidLoginCredentials(message: InfoMessage) {
  return {
    type: INVALID_LOGIN_CRED,
    alert: message
  };
}
function requestAuthToken(loginDetails: AuthenticateItem) {
  return {
    type: REQUEST_AUTH_TOKEN,
    loginDetails
  };
}

export function fetchLogin(loginDetails: AuthenticateItem) {
  return async (dispatch: any) => {
    dispatch(requestAuthToken(loginDetails));
    try{
      return await loginUser(loginDetails).then((response) => {
        if(response.status === 200 && response.data.message) {
          return dispatch(setAuthToken(response.data.message));
        }
        return dispatch(invalidLoginCredentials({
          header: "Failed to login",
          body: "Invalid Login Credentials"
        }));
      });
    } catch(e) {
      return dispatch(invalidLoginCredentials({
        header: "Failed to login",
        body: "Connection Issue"
      }));
    }
    
  };
}