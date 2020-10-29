import React from 'react';
import { shallow } from 'enzyme';
import Login from '../../../../src/Components/Login/Login';


describe("Login renders", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
      <Login.WrappedComponent/> );
  });

  it('should render page title.', () => {  
    expect(wrapper.text()).toContain('Login');
  });
  it('should render page subtitle.', () => {
    expect(wrapper.text()).toContain('Welcome back! Login to begin meal prepping!');
  })
});

describe("Login Input", () => {
  it('should capture email change correctly', () => { 
    const wrapper = shallow(<Login.WrappedComponent/>)
    const emailInput = wrapper.find('#email');
    emailInput.simulate("change", { target: { value: 'testemail@email.com' } });
    expect(wrapper.state().email).toBe("testemail@email.com");
  });
  it('should capture password change correctly', () => { 
    const wrapper = shallow(<Login.WrappedComponent/>)
    const passInput = wrapper.find('#password');
    passInput.simulate("change", { target: { value: 'testPass' } });
    expect(wrapper.state().password).toBe("testPass");
  });

  it('should call submit handler', () => { 
    const wrapper = shallow(<Login.WrappedComponent/>)
    const emailInput = wrapper.find('#email');
    const passInput = wrapper.find('#password');
    wrapper.instance().handleSubmit = jest.fn()
    wrapper.update()
    emailInput.simulate("change", { target: { value: 'testemail@email.com' } });
    passInput.simulate("change", { target: { value: 'testPass' } });
    const submitbutton = wrapper.find('.login-button')
    submitbutton.simulate('click')
    expect(wrapper.instance().handleSubmit).toHaveBeenCalled();
  });
  it('should call setState and history', async (done) => { 
    const wrapper = shallow(<Login.WrappedComponent/>)
    const emailInput = wrapper.find('#email');
    const passInput = wrapper.find('#password');
    
    emailInput.simulate("change", { target: { value: 'testemail@email.com' } });
    passInput.simulate("change", { target: { value: 'testPass' } });
    const mockPush = jest.fn()
    const mockLogin = jest.fn(async()=>{return})
    wrapper.setProps({
      history: {
        push: mockPush
      },
      fetchLogin: mockLogin
    })
    wrapper.update()
    await wrapper.instance().handleSubmit()
    expect(mockLogin).toHaveBeenCalledWith({password: "testPass", username: "testemail@email.com"});
    expect(mockPush).toHaveBeenCalledWith('/');
    done()
  });
});
