import { Grid, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import NavBar from '../NavBar/NavBar';


export interface ProfileProps {

}
export interface UserForm {
    username: string,
    password: string,
    email: string
}
const emptyProfilePicture = require('../../assets/emptyProfilePicture.png')
export default class Profile extends React.Component<ProfileProps, {
    image: any;
    loading: boolean;
    values: UserForm;
}>{

    constructor(props: ProfileProps) {
        super(props);

        this.state = {
            image: emptyProfilePicture,
            loading: false,
            values: {
                username: '',
                password: '',
                email: ''
            }
        }
    }
    componentDidMount() {

    }
    handleEmailChange = () => {

    }
    imagePress = () => {
        // this.handleFile()
    }
    // handleChange = (prop) => (event) => {
    //     this.setState({

    //     })
    //     setValues({ ...values, [prop]: event.target.value });
    //   };
    
    //    handleClickShowPassword = () => {
    //     setValues({ ...values, showPassword: !values.showPassword });
    //   };
    
    //    handleMouseDownPassword = (event) => {
    //     event.preventDefault();
    //   };


    //    handleSubmit = async (event) => {
    //     event.preventDefault();
    //     if(validateRequiredInfo()) {
    //         return;
    //     }
    //     //Validate
    //     const url = "http://localhost:3001/{apiVersion}/functions/spike-backend-dev-create/invocations"
    //     const body = {
    //         user: values.username,
    //         pass: values.password,
    //         email: values.email
    //     }

    //     await axios.post(url, body);
    //     history.push("/"); //TODO verify account was created?
        
        
    //   }
    //   handleChange = (prop) => (event) => {
    //     setValues({ ...values, [prop]: event.target.value });
    // };

    // handleSubmit = async (event) => {
    //     event.preventDefault();
    //     props.handleClose();
    //     // const user = {
    //     //     user: values.username,
    //     //     pass: values.password,
    //     //     email: values.email
    //     // }
    //     // await Hive.create(user);
    // } 
    handleFile(event: ChangeEvent<HTMLInputElement>) {
        const { target } = event;
        const { files } = target;

        if (files && files[0]) {
            var reader = new FileReader();

            reader.onloadstart = () => this.setState({ loading: true });

            reader.onload = event => {
                this.setState({
                    image: event.target?.result,
                    loading: false
                });
            };

            reader.readAsDataURL(files[0]);
        }
    }
    render() {
        return (
            <div>
                <NavBar />
                <div style={{ flex: 1 }}>
                    <div onClick={this.imagePress}>
                        <img style={{
                            height: '10vw',
                            width: '10vw',
                            borderRadius: 25,
                            border: '1px solid black',
                            objectFit: 'cover',
                            borderWidth: 1
                        }} src={this.state.image}>
                        </img>
                        <div>
                            <input
                                id="car"
                                type="file"
                                accept="image/*"
                                capture="camera"
                                onChange={this.handleFile.bind(this)}
                            />
                        </div>
                        <Grid container className="add">
                {/* <form noValidate id="add-form" onSubmit={handleSubmit} autoComplete="off">
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
                </form> */}
            </Grid>
                    </div>
                </div>
            </div>
        );
    }
}