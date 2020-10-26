import React from 'react';
import { shallow } from 'enzyme';
import Login from '../../../../../src/Components/login/Login';

let wrapper;
beforeEach(() => {
    wrapper = shallow(
            <Login.WrappedComponent/> );
});

//@TODO create more tests
describe("Login renders", () => {
  it('should render page title.', () => {  
    expect(wrapper.text()).toContain('Login');
  });
  it('should render page subtitle.', () => {
    expect(wrapper.text()).toContain('Welcome back! Login to begin meal prepping!');
  })
});

// beforeEach(() => {
//     wrapper = shallow(
//             <Login.WrappedComponent/> );
// });

// describe("Login Input", () => {
//   const setState = jest.fn();
//   const useStateSpy = jest.spyOn(React, "useState")
//   useStateSpy.mockImplementation((init) => [init, setState]);

//   it('should capture email change correctly', () => { 
//     const emailInput = wrapper.find('TextField').at(0);
//     console.log(emailInput.debug());
//     emailInput.instance().value = "testemail@email.com";
//     emailInput.simulate("change");
//     expect(setState).toHaveBeenCalledWith("testemail@email.com");
//   });

// });


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
