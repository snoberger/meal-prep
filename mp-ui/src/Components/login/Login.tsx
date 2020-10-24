import { Button, Card, CardContent, Link, TextField, Typography } from "@material-ui/core";
import "./Login.css";
import React from "react";


class Login extends React.Component {

    render() {
      return (
          <div className="login-div">
            <Typography variant="h3">Login</Typography>
            <Typography variant="subtitle1">Welcome back! Login to begin meal prepping!</Typography>
            <Card className="login-card">
                <form>
                    <CardContent>
                        <TextField className="login-input" label="Email Address"  variant="filled" ></TextField>
                        <TextField className="login-input" label="Password"  variant="filled" type="password"></TextField>
                        <Link className="forgot-password" href="/forgotpassword">Forgot Password?</Link>
                        <Button className="login-button" variant="contained" color="primary">Login</Button>
                        <div className="signup">
                            <Button className="signup-button" variant="contained" color="secondary">Sign up here</Button>
                        </div>
                        
                    </CardContent>
                </form>
               

            </Card>
          </div>
    );
    }
  }

  export default Login;