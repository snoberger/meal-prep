import React from 'react';
import { shallow } from 'enzyme';
import IngredientComponent from '../../../../src/Components/Pantry/Ingredient/Ingredient';

describe("ingredient renders", () => {
    it('should render the name by itself, and amount + metric', () => {  
        const wrapper = shallow(
            <IngredientComponent.WrappedComponent ingredient={{
                name: "test",
                amount: '1',
                metric: 'oz'
            }} /> );
        expect(wrapper.find('.ingredient-name').text()).toBe('TEST');
        expect(wrapper.find('.ingredient-amount').text()).toBe('1 OZ');
    });
});
