import React from "react";
import "./App.css";
import Routes from "./Routes";
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import rootReducer from './store/rootReducer';

const store = createStore(rootReducer, undefined, undefined);

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Routes></Routes>
        </div>
      </Provider>
    );
  }
}

export default App;
