import React from 'react';
import Login from './components/login/login';
import Signup from './components/signup/signup';
import './App.css';


const app = <div className="App">
  <Login></Login>
  <Signup></Signup>
</div>

function App() {
  return app;
}

export default App;
