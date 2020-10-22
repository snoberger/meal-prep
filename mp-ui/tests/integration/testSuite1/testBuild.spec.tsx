import React from 'react';
import { render } from '@testing-library/react';
import App from '../../../src/App';

describe("renders", () => {
    test("App Should Render", () => {
        const { getByText } = render(<App />);

        // This will break almost immediately
        const linkElement = getByText(/Hello World/i);
        expect(linkElement).toBeInTheDocument();
    });
});