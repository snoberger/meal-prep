import { Button, Card, CardContent, Link, TextField, Typography } from "@material-ui/core";
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Login.css";
import React from "react";
import { AppScreens } from "../../Routes";

interface ILoginProps extends RouteComponentProps<any> {

}

interface ILoginState {
    email?: string;
    password?: string;
    authToken?: string;
}


class Login extends React.Component<ILoginProps,ILoginState> {

    
    constructor(props: any) {
        super(props);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);

        this.state = {
            email: '',
            password: '',
        };
    }

    setUsername(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({email: e.target.value});
    }

    setPassword(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value});
    }

    async handleSubmit() {
        this.setState({authToken: "fakeToken"});
        this.props.history.push('/home');
    }
    
    render() {
      return (
          <div className="login-div">
            <Typography variant="h3">Login</Typography>
            <Typography variant="subtitle1">Welcome back! Login to begin meal prepping!</Typography>
            <Card className="login-card">
                <form>
                    <CardContent>
                        <TextField id="email" onChange={this.setUsername} value={this.state.email} className="login-input" label="Email Address" variant="filled" ></TextField>
                        <TextField id="password" onChange={this.setPassword} value={this.state.password} className="login-input" label="Password"  variant="filled" type="password"></TextField>
                        <Link className="forgot-password" href="/forgotpassword">Forgot Password?</Link>
                        <Button onClick={this.handleSubmit} className="login-button" variant="contained" color="primary">Login</Button>
                        <div className="signup">
                            <Button component={NavLink} to={AppScreens.SIGNUP} className="signup-button" variant="contained" color="secondary">Sign up here</Button>
                        </div>
                    </CardContent>
                </form>
            </Card>
          </div>
    );
    }
  }

  export default withRouter(Login);
  export let LoginNoRouter = Login;