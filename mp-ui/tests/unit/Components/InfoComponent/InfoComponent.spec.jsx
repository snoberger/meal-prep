import React from 'react';
import { mount } from 'enzyme';
import InfoComponent from '../../../../src/Components/InfoComponent/InfoComponent';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';


describe("infoComponent renders", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(
      <ThemeProvider theme={createMuiTheme({palette: {success: {main: '#0f0'}, error: {main: '#f00'}}})}>
        <InfoComponent.WrappedComponent message={{
      header: "TEST_HEADER",
      body: "TEST_BODY"}} />
        </ThemeProvider> );
  });

  it('should render component header.', () => {
    expect(wrapper.text()).toContain('TEST_HEADER');
  });
  it('should render component body.', () => {
    expect(wrapper.text()).toContain('TEST_BODY');
  })
});
