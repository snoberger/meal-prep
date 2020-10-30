import { Button, Card, CardContent, Link, TextField, Typography } from "@material-ui/core";
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Login.css";
import React from "react";
import { AppScreens } from "../../Routes";
import { connect, ConnectedProps } from 'react-redux';
import { fetchLogin} from '../../store/auth/actions/auth';

interface ILoginProps extends RouteComponentProps<any> {
}

interface ILoginState {
    email?: string;
    password?: string;
    authToken?: string;
}
const mapStateToProps = (state: ILoginState /*, ownProps*/) => {
    return {
        ...state
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchLogin: (loginItem: any) => dispatch(fetchLogin(loginItem)),
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type LoginCombinedProps = PropsFromRedux & ILoginProps;

class Login extends React.Component<LoginCombinedProps,ILoginState> {
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

    handleSubmit = async () => {
        await this.props.fetchLogin({
            username: this.state.email || "",
            password: this.state.password || ""
        });
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


export default connector(withRouter(Login));
export let LoginNoRouter = Login;