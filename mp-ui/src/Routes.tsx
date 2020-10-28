import React from "react";
import "./App.css";
import Login from "./Components/Login/Login";
import PrivateRoute from './PrivateRoute';
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
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
      <Switch>
        <Route path={AppScreens.LOGIN}>
          <Login></Login>
        </Route>
        <PrivateRoute
            exact={true}
            path='/home'
            component={Home}
        />
      </Switch>
    </div>
    );
  }
}

export default withRouter(Routes);
