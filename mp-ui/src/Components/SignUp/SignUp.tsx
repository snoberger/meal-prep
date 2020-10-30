import { Button, Card, CardContent, TextField, Typography } from "@material-ui/core";
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./SignUp.css";
import React from "react";
import { AppScreens } from "../../Routes";
import { connect, ConnectedProps } from 'react-redux';
import { fetchSignUp} from '../../store/user/actions/user';
import { CreateUserItem } from "../../api";

interface ISignUpProps extends RouteComponentProps<any> {
    fetchSignUp: (signUpDetails: CreateUserItem) => void
}

interface ISignUpState {
    email?: string;
    password?: string;
    confirmpassword?: string;
    authToken?: string;
}
const mapStateToProps = (state: ISignUpState /*, ownProps*/) => {
    return {
        ...state
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchSignUp: (SignUpItem: any) => dispatch(fetchSignUp(SignUpItem)),
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type SignUpCombinedProps = PropsFromRedux & ISignUpProps;

class Signup extends React.Component<SignUpCombinedProps,ISignUpState> {
    constructor(props: any) {
        super(props);
        this.setUsername = this.setUsername.bind(this);
        this.setPassword = this.setPassword.bind(this);
        this.setConfirmPassword = this.setConfirmPassword.bind(this);


        this.state = {
            email: '',
            password: '',
            confirmpassword: '',
        };
    }

    setUsername(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({email: e.target.value});
    }

    setPassword(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({password: e.target.value});
    }

    setConfirmPassword(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({confirmpassword: e.target.value});
    }


    handleSubmit = async () => {
        if(this.state.confirmpassword !== this.state.password){
            //handle error
            return;
        }
        const response = await this.props.fetchSignUp({
            username: this.state.email || "",
            password: this.state.password || "",
            confirmpassword: this.state.confirmpassword || ""
        });
        this.props.history.push('/home');
    }
    
    render() {
      return (
          <div className="signup-div">
            <Typography variant="h3">Sign Up</Typography>
            <Card className="signup-card">
                <form>
                    <CardContent>
                        <TextField id="email" onChange={this.setUsername} value={this.state.email} className="signup-input1" label="Email Address" variant="filled" ></TextField>
                        <TextField id="password" onChange={this.setPassword} value={this.state.password} className="signup-input1" label="Password"  variant="filled" type="password"></TextField>
                        <TextField id="confirm password" onChange={this.setConfirmPassword} value={this.state.confirmpassword} className="signup-input1" label="Confirm Password" variant="filled" type="password"></TextField>
                        <Button component={NavLink} to={AppScreens.HOME} className="signup-button1" variant="contained" color="primary">Sign Up</Button>                           
                        <div className="login">
                            <Button component={NavLink} to={AppScreens.LOGIN} className="login-click" variant="contained" color="secondary">Login</Button>
                        </div>         
                    </CardContent>
                </form>
            </Card>
          </div>
    );
    }
}


export default connector(withRouter(Signup));
export let SignupNoRouter = Signup;