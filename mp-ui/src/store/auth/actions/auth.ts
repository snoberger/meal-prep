import { AuthenticateItem, loginUser, checkAuthToken } from '../../../api';
import { InfoMessage } from '../../../Components/InfoComponent/InfoComponent';
import { SET_AUTH, REQUEST_AUTH_TOKEN, INVALID_LOGIN_CRED, CLEAR_AUTH_ALERT, INVALID_TOKEN } from '../actionTypes';


export const setAuth = (auth: any) => {
  return {
    type: SET_AUTH,
    authToken: auth.authToken,
    userId: auth.userId,
    pantryId: auth.pantryId
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
export const clearAuthAlert = () => {
    return {
      type: CLEAR_AUTH_ALERT,
      alert: undefined
    };
};

export function invalidToken(header: string, body: string) {
  return {
    type: INVALID_TOKEN,
    alert: {
      header,
      body
    }
  };
}

export const handleCheckAuthToken = () => {
  return async (dispatch: any) => {
    try{
      return await checkAuthToken().then((response: any) => {
          const authToken = sessionStorage.getItem('token');
          if(response.status === 200 && response.data.message && authToken) {
              return dispatch(setAuth({authToken: authToken, userId: response.data.message}));
          }
          return dispatch(invalidToken("Failed to authenticate", "Invalid Token"));
      });
    } catch(e) {
      return dispatch(invalidToken("Failed to authenticate","Invalid Token"));
    }
  };
};

export function fetchLogin(loginDetails: AuthenticateItem) {
  return async (dispatch: any) => {
    dispatch(requestAuthToken(loginDetails));
    try{
      return await loginUser(loginDetails).then((response) => {
        if(response.status === 200 && response.data.authToken && response.data.userId) {
            sessionStorage.setItem('token', response.data.authToken);
            return dispatch(setAuth(response.data));
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