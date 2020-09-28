import React, {useState} from "react";
import { useHistory } from "react-router-dom";
import axios from 'axios';
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Link from "@material-ui/core/Link";

import "./login.css";

export default function Login() {
    const [values, setValues] = useState({
        username: '',
        password: '',
    });
    const history = useHistory();

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = async () => {
        const url = "http://localhost:3001/{apiVersion}/functions/spike-backend-dev-authenticate/invocations"
        const body = {
            user: values.username,
            pass: values.password,
        }
        let response = await axios.post(url, body);
        let success = response.data.body === 'true';
        if(success) {
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