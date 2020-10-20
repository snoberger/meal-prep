import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { createMuiTheme, ThemeProvider } from "@material-ui/core";


const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#412d8b"
    },
    secondary: {
      main: "#cbd3f6"
    },
    success: {
      main: "#688d7d"
    },
    warning: {
      main: "#ffc285"
    },
    error: {
      main: "#A00320"
    }
  },
});

ReactDOM.render(
  <ThemeProvider theme={theme}><App /></ThemeProvider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

export default theme;