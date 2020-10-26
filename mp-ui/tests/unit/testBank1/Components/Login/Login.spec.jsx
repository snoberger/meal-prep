import React from 'react';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Routes from '../../../../../src/Routes';
import Login from '../../../../../src/Components/login/Login';

let wrapper;
beforeEach(() => {
    wrapper = shallow(
            <Login.WrappedComponent/> );
});

describe("Login renders", () => {
  it('should render page title.', () => {  
    expect(wrapper.text()).toContain('Login');
  });
  it('should render page subtitle.', () => {
    expect(wrapper.text()).toContain('Welcome back! Login to begin meal prepping!');
  })
});




// describe("Forgot Password Link", () => {
//     it("should link to /", () => {
//         const wrapper = shallow(
//             <MemoryRouter initialEntries={[ '/login' ]}>
//                 <Routes.WrappedComponent/>
//             </MemoryRouter>
//           );
//         expect(wrapper).toBeDefined();
//     });
// });
