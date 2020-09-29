import React from "react";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Home from "./components/home/Home";
import { Switch, Route, useLocation } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";
import Profile from "./components/profile";

export enum AppScreens {
  HOME = '/home',
  LOGIN = '/',
  SIGNUP = '/signup',
  PROFILE = '/profile'
}

const app = (
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
);

function App() {
  return app;
}

export default App;
