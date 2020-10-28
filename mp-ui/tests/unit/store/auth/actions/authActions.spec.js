import * as actions from '../../../../../src/store/auth/actions/auth';
import * as types from '../../../../../src/store/auth/actionTypes';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import api from '../../../../../src/api';
jest.mock('../../../../../src/api', ()=> {
  return ()=> {
    return {loginUser: jest.fn()}
  }
})
const middlewares = [thunk]
const mockStore = configureMockStore(middlewares)

describe("Synchronous Actions", () => {
  it('should create setAuthToken action', () => {  
    const expectedAction = {
      type: types.SET_AUTH_TOKEN,
      authToken: 'dummyToken'
    }
    expect(actions.setAuthToken('dummyToken')).toEqual(expectedAction)
  });
  it('should create invalidLoginCredentials action', () => {  
    const expectedAction = {
      type: types.INVALID_LOGIN_CRED,
    }
    expect(actions.invalidLoginCredentials()).toEqual(expectedAction)
  });
});

describe("Asynchronous Actions", () => {

  it('creates SET_AUTH_TOKEN when login is done succesfully', () => {
    api.loginUser = jest.fn().mockImplementationOnce(()=> {
      return Promise.resolve({
        status: 200,
        data: {
          message: 'dummyToken'
        }
      })
    })

    const expectedActions = [
      { type: types.REQUEST_AUTH_TOKEN },
      { type: types.SET_AUTH_TOKEN, authToken: 'dummyToken' }
    ]
    const store = mockStore({ auth: {authToken: ''} })
    expect.assertions(1);
    store.dispatch(actions.fetchLogin()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('creates INVALID_LOGIN_CRED when login fails', () => {
    api.loginUser = jest.fn().mockImplementationOnce(()=> {
      return Promise.resolve({
        status: 500,
        data: {}
      })
    })

    const expectedActions = [
      { type: types.REQUEST_AUTH_TOKEN },
      { type: types.INVALID_LOGIN_CRED }
    ]
    const store = mockStore({ auth: {authToken: ''} })
    expect.assertions(1);
    store.dispatch(actions.fetchLogin()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })

  it('creates INVALID_LOGIN_CRED when error is thron', () => {
    api.loginUser = jest.fn().mockImplementationOnce(()=> {
      throw 'error'
    })

    const expectedActions = [
      { type: types.REQUEST_AUTH_TOKEN },
      { type: types.INVALID_LOGIN_CRED }
    ]
    const store = mockStore({ auth: {authToken: ''} })
    expect.assertions(1);
    store.dispatch(actions.fetchLogin()).then(() => {
      expect(store.getActions()).toEqual(expectedActions)
    })
  })
});

