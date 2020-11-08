import React from 'react';
import { shallow } from 'enzyme';
import Pantry from '../../../../src/Components/Pantry/Pantry';
import Closet from "../../../../src/Components/Pantry/Closet/Closet";
import { Typography } from "@material-ui/core";

describe("Pantry renders", () => {
    it('should render title and closet component', () => {  
        const wrapper = shallow(
            <Pantry.WrappedComponent /> );
        expect(wrapper.find(Typography).text()).toBe('My Pantry');
        expect(wrapper.find(Closet).length).toBe(1);
    });
});
