import React from "react";
import axios from 'axios';
import Input from '@material-ui/core/Input'
import Button from '@material-ui/core/Button'
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import "./login.css";
export default function Login() {
    const username ="";
    const password = "";
    const done = false;
    const handleSubmit = () => {
        const url = "https://wcf4atd78l.execute-api.us-east-1.amazonaws.com/default/spike-backend-prod-create"
        const body = {
            user: username,
            pass: password
        }
        axios.post(url, body)
            .then(() => {
                done = true;
            })
    }
    return (
        <div>
            <Card className="login">
                <CardContent>
                    <Typography gutterBottom variant="h5" component="h2">
                        Login
                    </Typography>
                    <Input className="input" placeholder="user" value={username} label="username" disabled={done}/>
                    <Input className="input" placeholder="password"  value={password} label="password" disabled={done}/>
                    <Button className="submit" variant="contained" color="primary" onClick={handleSubmit}>
                        Submit
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}