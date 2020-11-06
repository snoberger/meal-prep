import React from "react";
import "./App.css";
import Login from "./Components/Login/Login";
import PrivateRoute from './PrivateRoute';
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import Home from "./Components/Home/Home";
import Pantry from "./Components/Pantry/Pantry";
import SignUp from "./Components/SignUp/SignUp";

export enum AppScreens {
  HOME = '/',
  LOGIN = '/login',
  SIGNUP = '/signup',
  FORGOT = '/forgotPassword',
  PROFILE = '/profile',
  COOK = '/cook',
  RECIPES = '/recipes',
  PANTRY = '/pantry',
  CALENDAR = '/calendar',
}

interface IRouteProps extends RouteComponentProps<any> {

}

interface IRouteState {
}


class Routes extends React.Component<IRouteProps,IRouteState> {
  render() {
    return (
    <div>
      <Switch>
        <Route path={AppScreens.LOGIN}>
          <Login></Login>
        </Route>
        <Route path={AppScreens.SIGNUP}>
          <SignUp></SignUp>
        </Route>
        <PrivateRoute
            exact={true}
            path={AppScreens.PANTRY}
            component={Pantry}
        />
        <PrivateRoute
            exact={true}
            //path={AppScreens.HOME} not specifying the route means it will catch any route that isnt found and send it to home
            component={Home}
        />
      </Switch>
    </div>
    );
  }
}

export default withRouter(Routes);
