import { SET_AUTH_TOKEN } from '../actionTypes';

export const setAuthToken = (authToken: string) => {
  return {
    type: SET_AUTH_TOKEN,
    authToken
  };
};