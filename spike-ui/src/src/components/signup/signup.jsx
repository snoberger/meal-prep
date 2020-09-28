import { Card, Typography, TextField, InputLabel, OutlinedInput, InputAdornment, FormControl, IconButton, Button, Box} from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React from "react";
import { useState }   from "react";

import "./signup.css";

export default function Signup() {

    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        showPassword: false
      });

      

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
      const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };


      const handleSubmit = (event) => {
        event.preventDefault();
        //Validate
        console.log( 'Email:', values.email, 'Username: ', values.username, 'Password:', values.password); 
      }

    return (
        <div>
            <Card className="signup">
                <Typography gutterBottom variant="h5" component="h2"> Create Account </Typography>
                <form noValidate  id="signup-form" onSubmit={handleSubmit} autoComplete="off">
                    <TextField required className="textbox"
                                        id="email" 
                                        value={values.email} 
                                        onInput={handleChange("email")} 
                                        label="Email Address" 
                                        variant="outlined" />
                    <TextField required className="textbox" 
                                        id="username" 
                                        value={values.username} 
                                        onInput={handleChange("username")} 
                                        label="Username" 
                                        variant="outlined" />
                    <FormControl required className="textbox" variant="outlined">
                        <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={values.showPassword ? "text" : "password"}
                                value={values.password}
                                onChange={handleChange("password")}
                                endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                    >
                                    {values.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                                }
                                labelWidth={80}
                            />
                    </FormControl><br/>
                    <Box className="submit">
                        <Button type="submit" form="signup-form" variant="contained" color="primary">
                        Sign Up
                        </Button>
                    </Box>
                </form>
                
            </Card>
        </div>
    )
}