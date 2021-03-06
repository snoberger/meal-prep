import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Routes from "./Routes";
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import { createStore, applyMiddleware } from 'redux';
import rootReducer from './store/rootReducer';

const store = createStore(rootReducer, undefined, applyMiddleware(thunkMiddleware));

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Navbar></Navbar>
          <Routes></Routes>
        </div>
      </Provider>
    );
  }
}

export default App;
