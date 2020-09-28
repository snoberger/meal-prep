import React from "react";
import Login from "./components/login/login";
import Signup from "./components/signup/signup";
import Home from "./components/home/Home";
import { Switch, Route } from "react-router-dom";
import "./App.css";
import PrivateRoute from "./components/PrivateRoute";

const app = (
  <div className="App">
    <Switch>
      <Route path="/signup">
        <Signup></Signup>
      </Route>
      <PrivateRoute path="/home" component={Home}/>
      <Route path="/">
        <Login></Login>
      </Route>
    </Switch>
  </div>
);

function App() {
  return app;
}

export default App;
