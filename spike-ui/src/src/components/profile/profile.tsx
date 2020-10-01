import { Box, Button, Grid, TextField } from '@material-ui/core';
import React, { ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import { AppScreens } from '../../App';
import { getuser } from '../../libs/User';
import { User } from '../../libs/util';
import NavBar from '../NavBar/NavBar';
import './profile.css';


export interface ProfileProps {
    history: History
}
export interface UserForm {
    user: string,
    email: string,
    address: string
}
const emptyProfilePicture = require('../../assets/emptyProfilePicture.png')
export default class Profile extends React.Component<ProfileProps, {
    image?: any;
    loading: boolean;
    userId: string;
    values: UserForm;
}>{
    constructor(props: ProfileProps) {
        super(props);

        this.state = {
            image: emptyProfilePicture,
            loading: false,
            userId: '',
            values: {
                user: '',
                address: '',
                email: ''
            }
        }
    }
    componentDidMount() {
        this.loadUser();
    }

    loadUser = async () => {
        const user = await (await getuser(localStorage.getItem('auth') || '')).data
        this.setState({
            values: {
                user: user.user || '',
                email: user.email || '',
                address: user.address || ''
            },
            userId: user.userId,
            ...user.image && user.image !== 'none' ? { image: user.image } : undefined
        })
    }

    handleChangeUser = (event: any) => {
        this.setState({
            values: {
                ...this.state.values,
                user: event.target.value
            }
        })
    };

    handleChangeEmail = (event: any) => {
        this.setState({
            values: {
                ...this.state.values,
                email: event.target.value
            }
        })
    };
    handleChangeAddress = (event: any) => {
        this.setState({
            values: {
                ...this.state.values,
                address: event.target.value
            }
        })
    };

    handleSubmit = async (event: any) => {
        event.preventDefault();

        await User.updateUser(
            this.state.userId, {
            ...this.state.values,
            image: this.state.image
        }).catch(() => {
            alert("Image too large, upload an image less than 400KB");
        })
    }
    handleDelete = async (event: any) => {
        event.preventDefault();
        await User.deleteUser(this.state.userId).then(() => {
            localStorage.removeItem("auth");
            // @ts-ignore
            this.props.history.push(AppScreens.LOGIN);
        }).catch((error) => {
            console.log(error)
            alert("Failed to delete user")
        })
    }
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
                <div style={{ flex: 1, marginTop: 10 }}>
                    <div>
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
                        <Grid container justify="center">
                            <form noValidate id="add-form" onSubmit={this.handleSubmit} autoComplete="off">
                                <TextField required className="textbox"
                                    id="email"
                                    value={this.state.values.email}
                                    onInput={this.handleChangeEmail}
                                    label="Email Address"
                                    variant="outlined" />
                                <TextField required className="textbox"
                                    id="username"
                                    value={this.state.values.user}
                                    onInput={this.handleChangeUser}
                                    label="Username"
                                    variant="outlined" />
                                <TextField className="textbox"
                                    id="Address"
                                    value={this.state.values.address}
                                    onInput={this.handleChangeAddress}
                                    label="Address"
                                    variant="outlined" /><br />
                                <Box className="submit-add">
                                    <Button className="submit-button" type="submit" form="add-form" variant="contained" color="primary">
                                        Submit
                                    </Button>
                                    <Button className="submit-button" onClick={this.handleDelete} variant="contained" color="secondary">
                                        Delete User
                                    </Button>
                                </Box>
                            </form>
                        </Grid>
                    </div>
                </div>
            </div>
        );
    }
}