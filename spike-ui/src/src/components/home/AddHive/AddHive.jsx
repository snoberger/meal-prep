import React, {useState} from "react";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Button, Box, TextField, Card} from "@material-ui/core";
import { Hive } from '../../../libs/util.ts';
import './AddHive.css';


const AddHive = React.forwardRef((props, ref) => {
    const [values, setValues] = useState({
        email: '',
        username: '',
        password: '',
        address: '',
        showPassword: false
      });

    const handleChange = (prop) => (event) => {
        setValues({ ...values, [prop]: event.target.value });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        props.handleClose();
        // const user = {
        //     user: values.username,
        //     pass: values.password,
        //     email: values.email
        // }
        // await Hive.create(user);
    } 
    return (
        <Card className="overflow-card">
            <AppBar position="static" className="add-bar" color="secondary">
                <Typography variant="h6" style={{flexGrow: 1}}>
                    Add a new Hive
                </Typography>
            </AppBar>
            <Grid container className="add">
                <form noValidate id="add-form" onSubmit={handleSubmit} autoComplete="off">
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
                    <TextField  className="textbox"
                                id="Address" 
                                value={values.address} 
                                onInput={handleChange("address")} 
                                label="Address" 
                                variant="outlined" /><br/>
                    <Box className="submit-add">
                        <Button className="submit-button" type="submit" form="add-form" variant="contained" color="primary">
                        Submit
                        </Button>
                    </Box>
                </form>
            </Grid>
        </Card>
    )
})

export default AddHive