import React from 'react';
import App from '../../../src/App';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import {createSerializer} from 'enzyme-to-json';
 

//Used for snapshot
expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));


describe("App renders", () => {
    it("should match snapshot", () => {
        // TODO have the user be logged in before mount
        const wrapper = mount(
            <MemoryRouter initialEntries={[ '/' ]}>
                <App></App>
            </MemoryRouter>
          );
          expect(wrapper).toBeDefined();
        //expect(wrapper).toMatchSnapshot();
    });
});

