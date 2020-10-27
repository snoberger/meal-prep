import React from "react";
import "./App.css";
import Login from "./Components/login/Login";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";

export enum AppScreens {
  HOME = '/home',
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
        <Route path={AppScreens.LOGIN}>
          <Login></Login>
        </Route>
    );
  }
}

export default withRouter(Routes);
