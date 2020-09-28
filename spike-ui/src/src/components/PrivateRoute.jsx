import React from "react";
import { Route, Redirect} from "react-router-dom";

const fakeAuth ={
    isAuthenticated: true
}
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      fakeAuth.isAuthenticated === true
        ? <Component {...props} />
        : <Redirect to="/login" />
    )} />
  )
export default PrivateRoute;
