import React from 'react';
import { shallow } from 'enzyme';
import Home from '../../../../src/Components/Home/Home';


describe("Home renders", () => {
  it('should render all four cards.', () => {  
    const wrapper = shallow(
        <Home.WrappedComponent/> );
    expect(wrapper.find('#cook').length).toBe(1);
    expect(wrapper.find('#recipes').length).toBe(1);
    expect(wrapper.find('#pantry').length).toBe(1);
    expect(wrapper.find('#calendar').length).toBe(1);
  });
});

describe("Home Navigation", () => {
  it('should go to cook', () => { 
    const wrapper = shallow(<Home.WrappedComponent/>)
    const mockPush = jest.fn()
    wrapper.setProps({
      history: {
        push: mockPush
      },
    })
    wrapper.update()
    const cookCard = wrapper.find('#cook');
    cookCard.simulate("click");
    expect(mockPush).toHaveBeenCalledWith('/cook');
  });
  it('should go to recipes', () => { 
    const wrapper = shallow(<Home.WrappedComponent/>)
    const mockPush = jest.fn()
    wrapper.setProps({
      history: {
        push: mockPush
      },
    })
    wrapper.update()
    const cookCard = wrapper.find('#recipes');
    cookCard.simulate("click");
    expect(mockPush).toHaveBeenCalledWith('/recipes');
  });
  it('should go to calendar', () => { 
    const wrapper = shallow(<Home.WrappedComponent/>)
    const mockPush = jest.fn()
    wrapper.setProps({
      history: {
        push: mockPush
      },
    })
    wrapper.update()
    const cookCard = wrapper.find('#calendar');
    cookCard.simulate("click");
    expect(mockPush).toHaveBeenCalledWith('/calendar');
  });
  it('should go to pantry', () => { 
    const wrapper = shallow(<Home.WrappedComponent/>)
    const mockPush = jest.fn()
    wrapper.setProps({
      history: {
        push: mockPush
      },
    })
    wrapper.update()
    const cookCard = wrapper.find('#pantry');
    cookCard.simulate("click");
    expect(mockPush).toHaveBeenCalledWith('/pantry');
  });

});
