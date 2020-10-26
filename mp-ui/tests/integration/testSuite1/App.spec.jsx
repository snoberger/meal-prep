import React from 'react';
import App from '../../../src/App';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../src/Components/login/Login';
import Routes from '../../../src/Routes';
import {createSerializer} from 'enzyme-to-json';
 

//Used for snapshot
expect.addSnapshotSerializer(createSerializer({mode: 'deep'}));


describe("App renders", () => {
    it("should match snapshot", () => {
        const wrapper = mount(
            <MemoryRouter initialEntries={[ '/' ]}>
                <App></App>
            </MemoryRouter>
          );
        expect(wrapper).toMatchSnapshot();
    });
});

