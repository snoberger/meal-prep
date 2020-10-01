import React from "react";
import NavBar from "../NavBar/NavBar";
import PublicProfile from "./PublicProfile/PublicProfileWrapper";
import { getAllUsers } from '../../libs/User';
import {Grid, Typography, TextField} from '@material-ui/core';
import { Autocomplete } from '@material-ui/lab';
import './Public.css';

export interface PublicProps {
    history: History
}
export interface User {
    userId: string,
    user: string
}
export default class Public extends React.Component<PublicProps, {
    userId: string
    users: Array<User>
    profile: any;
}>{
    constructor(props: PublicProps) {
        super(props);

        this.state = {
            userId: '',
            users: [],
            profile: <div></div>
        }
    }
    
    componentDidMount() {
        this.loadUsers();
    }

    async loadUsers () {
        const users = await (await getAllUsers()).data;
        this.setState({
            ...this.state,
            users: users,
        })
    }

    handleChangeUserId = (event: any, value: string) => {
        let user = this.state.users.find((user) => (user.user === value))
        if(user) {
            this.setState({
                ...this.state,
                userId: value,
                profile: <PublicProfile userId={user.userId}/>
            }) 
        }
    };

    render () {
        return (<div>
            <NavBar />
            <Grid style={{ marginTop: "5em", marginBottom: '10em'}} container justify="center" >
                <Grid item className="prompt"> 
                    <Typography>Search for a member of the community</Typography>
                </Grid>
                <Grid container className="search-container" justify="center"> 
                    <Autocomplete
                        className="search-box"
                        disableClearable
                        onInputChange={this.handleChangeUserId}
                        options={this.state.users.map((option) => option.user)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Search"
                                margin="normal"
                                variant="outlined"
                                InputProps={{ ...params.InputProps, type: 'search' }}
                            />
                        )}
                    />
                </Grid>
                <Grid container className="profile-container" justify="center"> 
                    {this.state.profile}
                </Grid>
            </Grid>
        </div>)
    }
}