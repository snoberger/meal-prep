import React from 'react';
import { shallow } from 'enzyme';
import Navbar from '../../../../../src/Components/Navbar/Navbar';



describe("Navbar renders", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = shallow(
        <Navbar.WrappedComponent/> );
  });

  it('should render title', () => {  
    expect(wrapper.text()).toContain('Pre-Prep Meal Prep');
  });
});
describe("Navbar Button Functions", () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallow(<Navbar.WrappedComponent/> );
    });

    afterEach(() => {
        wrapper = null;
    })
  
    it('Logout button should call onLogout.', () => {  
        const mockLogout = jest.fn();
        wrapper.instance().onLogout = mockLogout;
        wrapper.instance().forceUpdate();

        const logoutButton = wrapper.find("#logout-button");   
        logoutButton.simulate('click');

        expect(mockLogout).toHaveBeenCalled();
    });

    it('onLogout should set anchorEl to null', () => {
        const logoutSpy = jest.spyOn(wrapper.instance(), "onLogout");
        wrapper.instance().forceUpdate();
        const logoutButton = wrapper.find("#logout-button");   
        logoutButton.simulate('click');

        expect(wrapper.state().anchorEl).toBe(null);
        expect(logoutSpy).toBeCalled();
    });

    it('Icon button should call handleMenuClick.', () => {  
        const mockMenuClick = jest.fn();
        wrapper.instance().handleMenuClick = mockMenuClick;
        wrapper.instance().forceUpdate();

        const iconButton = wrapper.find("#icon-button");   
        iconButton.simulate('click');

        expect(mockMenuClick).toHaveBeenCalled();
    });

    it('handleMenuClick should update state with event target', () => {  
        const menuSpy = jest.spyOn(wrapper.instance(), "handleMenuClick");
        wrapper.instance().forceUpdate();

        const iconButton = wrapper.find("#icon-button");   
        iconButton.simulate("click", { currentTarget: {value: "test Target"}});

        expect(wrapper.state().anchorEl).toBeDefined();
        expect(menuSpy).toBeCalled();
    });

    it('Profile button should call handleClose.', () => {  
        const mockMenuClick = jest.fn();
        wrapper.instance().handleClose = mockMenuClick;
        wrapper.instance().forceUpdate();

        const profileButton = wrapper.find("#profile-button");   
        profileButton.simulate('click');

        expect(mockMenuClick).toHaveBeenCalled();
    });

    
    it('handleClose should set anchorEl to null', () => {
        const closeSpy = jest.spyOn(wrapper.instance(), "handleClose");
        wrapper.instance().forceUpdate();
        const profileButton = wrapper.find("#profile-button");   
        profileButton.simulate('click');

        expect(wrapper.state().anchorEl).toBe(null);
        expect(closeSpy).toBeCalled();
    });



  });
  