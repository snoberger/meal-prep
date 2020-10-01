import React from "react";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Home from "./components/home/Home";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import amber from '@material-ui/core/colors/amber';

import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/profile";

export enum AppScreens {
  HOME = '/home',
  LOGIN = '/',
  SIGNUP = '/signup',
  PROFILE = '/profile'
}

const Theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: amber,
  },
});

const app = (
  <ThemeProvider theme={Theme}>
    <div className="App">
      <Switch>
        <Route path={AppScreens.SIGNUP}>
          <Signup></Signup>
        </Route>
        <PrivateRoute path={AppScreens.HOME} component={Home}/>
        <PrivateRoute path={AppScreens.PROFILE} component={Profile}/>
        <Route path={AppScreens.LOGIN}>
          <Login></Login>
        </Route>
      </Switch>
    </div>
  </ThemeProvider>
);

function App() {
  return app;
}

export default App;
