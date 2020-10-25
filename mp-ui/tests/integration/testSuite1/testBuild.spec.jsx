import React from 'react';
import App from '../../../src/App';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';
import Login from '../../../src/Components/login/Login';
import Routes from '../../../src/Routes';

//Temporary may need?
// jest.mock("react-router-dom", () => { 
//     return {
//         ...jest.requireActual("react-router-dom"),
//         BrowserRouter: ({children}) => <div>{children}</div>
//     }
// });

describe("renders", () => {
    it("App Should Render", () => {
        const wrapper = shallow(
            <MemoryRouter initialEntries={[ '/' ]}>
                <Routes.WrappedComponent/>
            </MemoryRouter>
          );
        expect(wrapper).toBeDefined();
    });
});

