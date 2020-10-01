import React from "react";
import { Route, Redirect} from "react-router-dom";

const fakeAuth = () => {
  if(localStorage.getItem("auth")) {
    return true
  }
  return false
}
const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
      fakeAuth() === true
        ? <Component {...props} />
        : <Redirect to="/" />
    )} />
  )
export default PrivateRoute;
