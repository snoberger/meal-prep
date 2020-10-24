import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from "@material-ui/core/Link";
import { User } from '../../libs/util';
import "./login.css";

export default function Login() {
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const history = useHistory();

    handleChange(e) {
        this.setState({value: e.target.value});
      }

    const handleSubmit = async () => {
        const user = {
            user: values.username,
            pass: values.password,
        }
        let response = await User.authenticate(user);
        if(response.data) {
            localStorage.setItem('auth', response.data);
            history.push("/home");
        } else {
            alert("Invalid login.");
        }
    }
    return (
        <div>
            <Card className="login">
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Login
                    </Typography>
                    <TextField onInput={handleChange("username")} className="input" placeholder="Username" value={values.username} label="Username" />
                    <TextField onInput={handleChange("password")} className="input" placeholder="Password" type="password" value={values.password} label="Password" />
                    <Button className="submit" variant="contained" color="primary" onClick={handleSubmit}>
                        Login
                    </Button>
                </CardContent>
                <Link className="new-account" href="/signup">New Account</Link>
            </Card>
        </div>
    )
}