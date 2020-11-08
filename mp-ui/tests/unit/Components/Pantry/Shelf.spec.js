import React from 'react';
import { shallow } from 'enzyme';
import IngredientComponent from "../../../../src/Components/Pantry/Ingredient/Ingredient";
import Shelf from "../../../../src/Components/Pantry/Shelf/Shelf";
import { Add } from "@material-ui/icons";

describe("Closet rendering", () => {
    it('should render a single shelf if no ingredients', () => {  
        const wrapper = shallow(
            <Shelf.WrappedComponent shelfItems={[]}/> );
        expect(wrapper.find(IngredientComponent).length).toBe(0);
        expect(wrapper.find(Add).length).toBe(1);
    });
    it('if there are some but less than 6 ingredients show add', () => {
        const ingreds = [{
                name: 'test',
                amount: '1',
                metric: 'oz'
            }]
        const wrapper = shallow(
            <Shelf.WrappedComponent shelfItems={ingreds}/> 
            );
        expect(wrapper.find(IngredientComponent).length).toBe(1);
        
        expect(wrapper.find(Add).length).toBe(1);
    });
    it('if there are 6 dont show add', () => { 
        const ingreds = [{
            name: 'test',
            amount: '1',
            metric: 'oz'
            },
            {
                name: 'test',
                amount: '1',
                metric: 'oz'
            },
            {
                name: 'test',
                amount: '1',
                metric: 'oz'
            },
            {
                name: 'test',
                amount: '1',
                metric: 'oz'
            },
            {
                name: 'test',
                amount: '1',
                metric: 'oz'
            },
            {
                name: 'test',
                amount: '1',
                metric: 'oz'
            },
        ] 
        const wrapper = shallow(
            <Shelf.WrappedComponent shelfItems={ingreds}/> 
            );
        expect(wrapper.find(IngredientComponent).length).toBe(6);
        expect(wrapper.find(Add).length).toBe(0);
    });
});
