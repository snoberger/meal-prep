import React from 'react';
import { shallow } from 'enzyme';
import Closet from "../../../../src/Components/Pantry/Closet/Closet";
import Shelf from "../../../../src/Components/Pantry/Shelf/Shelf";


describe("Closet rendering", () => {
    it('should render a single shelf if no ingredients', () => {  
        const wrapper = shallow(
            <Closet.WrappedComponent ingredients={[]}/> );
        expect(wrapper.find(Shelf).length).toBe(1);
    });
    it('if there are a multiple of 6 ingredients there are that many shelves + 1', () => {  
        const ingreds = []
        for(let i = 0; i < 24; i++) {
            ingreds.push({
                name: 'test',
                amount: '1',
                metric: 'oz'
            })
        }
        const wrapper = shallow(
            <Closet.WrappedComponent ingredients={ingreds}/> 
            );
        expect(wrapper.find(Shelf).length).toBe(5);
    });
    it('if there are a multiple of 6 ingredients + some there are that many shelves', () => {  
        const ingreds = []
        for(let i = 0; i < 20; i++) {
            ingreds.push({
                name: 'test',
                amount: '1',
                metric: 'oz'
            })
        }
        const wrapper = shallow(
            <Closet.WrappedComponent ingredients={ingreds}/> 
            );
        expect(wrapper.find(Shelf).length).toBe(4);
    });
});
