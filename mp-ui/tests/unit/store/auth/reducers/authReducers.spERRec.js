import reducer from '../../../../../src/store/auth/reducers/auth';
import * as getters from '../../../../../src/store/auth/reducers/auth';

import * as types from '../../../../../src/store/auth/actionTypes';

describe('auth reducer handlers', () => {
  it('should return the initial state', () => {
    expect(reducer(undefined, {})).toEqual([
      {
        authToken: ''
      }
    ])
  })

  it('should handle SET_AUTH_TOKEN', () => {
    expect(
      reducer([], {
        type: types.SET_AUTH_TOKEN,
        text: 'dummyToken'
      })
    ).toEqual(
      {
        authToken: 'dummyToken'
      }
    )
  })
})

describe('auth reducer getters', () => {
  it('should return the initial state', () => {
    expect(getters.getAuthToken({ auth: { authToken: 'dummytoken'}})).toEqual('dummyToken')
  })
})