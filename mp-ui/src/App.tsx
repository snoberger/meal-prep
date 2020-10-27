import React from "react";
import "./App.css";
import Navbar from "./Components/Navbar/Navbar";
import Routes from "./Routes";



class App extends React.Component {
  render() {
    return (
      <div className="App">
        <Navbar></Navbar>
        <Routes></Routes>
      </div>
    );
  }
}

export default App;
