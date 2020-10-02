import { Card, Typography, TextField, InputLabel, OutlinedInput, InputAdornment, FormControl, IconButton, Button, Box, Link} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React from "react";
import { useState }   from "react";
import { User } from '../../libs/util.ts';

import "./signup.css";

export default function Signup() {

    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        address: '',
        showPassword: false
      });
      const history = useHistory();

      

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
      };
    
      const handleClickShowPassword = () => {
        setValues({ ...values, showPassword: !values.showPassword });
      };
    
      const handleMouseDownPassword = (event) => {
        event.preventDefault();
      };


      const handleSubmit = async (event) => {
        event.preventDefault();
        if(validateRequiredInfo()) {
            return;
        }
        //Validate
        const user = {
            user: values.username,
            pass: values.password,
            email: values.email,
            address: values.address
        }
        await User.create(user);
        history.push("/login"); //TODO verify account was created?
      }

      const validateRequiredInfo = () => {
          let errorMesssage = "Missing Fields:";
          let errorFound = false;
          const requiredFields = ['email','username','password'];
          requiredFields.forEach(element => {
              if(!values[element] || values[element] === '') {
                    errorMesssage = errorMesssage + " " + element; //Update this to show errors on the input
                    errorFound = true;
              }
          });
          if(errorFound) {
            alert(errorMesssage);
          }
          return errorFound;
      }

    return (
        <div>
            <Card className="signup">
                <Typography gutterBottom variant="h5" component="h2"> Create Account </Typography>
                <form noValidate id="signup-form" onSubmit={handleSubmit} autoComplete="off">
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
                    </FormControl>
                    <TextField  className="textbox"
                                id="Address" 
                                value={values.address} 
                                onInput={handleChange("address")} 
                                label="Address" 
                                variant="outlined" /><br/>
                    <Box className="submit-box">
                        <Link className="login-link" href="/">Have an account? Login here.</Link>
                        <Button className="submit-button" type="submit" form="signup-form" variant="contained" color="primary">
                        Sign Up
                        </Button>
                    </Box>
                </form>
                
            </Card>
        </div>
    )
}