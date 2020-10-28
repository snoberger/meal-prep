import * as actions from '../../../../../src/store/auth/actions/auth';
import * as types from '../../../../../src/store/auth/actionTypes';

describe("Synchronous Actions", () => {
  it('should render page title.', () => {  
    const expectedAction = {
      type: types.SET_AUTH_TOKEN,
      authToken: 'dummyToken'
    }
    expect(actions.setAuthToken('dummyToken')).toEqual(expectedAction)
  });
});

