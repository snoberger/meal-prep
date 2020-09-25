import { Card, Typography, TextField, InputLabel } from "@material-ui/core";
import React from "react";

import "./signup.css";

export default function Signup() {

    return (
        <div>
            <Card className="signup">
                <Typography gutterBottom variant="h5" component="h2"> Create Account </Typography>
                <form noValidate  autoComplete="off">
                    <TextField className="textbox" required id="email" label="Email Address" variant="outlined" />
                    <TextField className="textbox" required id="username" label="Username" variant="outlined" />
                </form>
            </Card>
        </div>
    )
}