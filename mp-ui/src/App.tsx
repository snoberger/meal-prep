import React from "react";
import "./App.css";
import { Button, useTheme } from "@material-ui/core";

function App() {
  const theme = useTheme();
  return (
    <div className="App">
      <style>
        {`
        :root {
          --secondary-color: ${theme.palette.secondary.main};
        }`}
      </style>
      <Button
        className="Button"
        type="submit"
        variant="contained"
        color="primary"
      >
        <text className="Button-text">Hello World</text>
      </Button>
    </div>
  );
}

export default App;
