import React from "react";
import "./App.css";
import Login from "./Components/login/Login";
import PrivateRoute from './PrivateRoute';
import { Route, RouteComponentProps, withRouter } from "react-router-dom";
import Home from "./Components/Home/Home";

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
    <div>
      <Route path={AppScreens.LOGIN}>
        <Login></Login>
      </Route>
      <PrivateRoute
          exact={true}
          path='/home'
          component={Home}
      />
    </div>
    );
  }
}

export default withRouter(Routes);
