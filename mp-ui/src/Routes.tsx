import React from "react";
import "./App.css";
import Login from "./Components/login/Login";
import { Route, RouteComponentProps, withRouter } from "react-router-dom";

export enum AppScreens {
  HOME = '/',
  LOGIN = '/login',
  SIGNUP = '/signup',
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
