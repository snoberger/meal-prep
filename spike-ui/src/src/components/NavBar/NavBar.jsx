import { AppBar, Button, Toolbar, Typography } from '@material-ui/core';
import React from 'react';
import { useHistory, NavLink } from "react-router-dom";
import { AppScreens } from '../../App';
import './NavBar.css';

export default function NavBar() {


    const history = useHistory();



    const onHome = () => {
        history.push(AppScreens.HOME);
    }
    const onPublic = () => {
        history.push(AppScreens.PUBLIC);
    }
    const onProfile = () => {
    }
    const onLogout = () => {
        localStorage.removeItem("auth");
        history.push(AppScreens.LOGIN);
    }
    
    
    return (
        <AppBar position="static">
            <Toolbar>
            <Typography variant="h6" className="title">
                Badger Hive Management System
            </Typography>
                <Button exact component={NavLink} to={AppScreens.PUBLIC} activeClassName="active-button" onClick={onPublic} className="menu-button" color="inherit">
                    Community
                </Button>
                <Button component={NavLink} to={AppScreens.HOME} activeClassName="active-button" onClick={onHome} className="menu-button" color="inherit">
                    Home
                </Button>
                <Button component={NavLink} to={AppScreens.PROFILE} activeClassName="active-button" onClick={onProfile} className="menu-button" color="inherit">
                    Profile
                </Button>
                <Button onClick={onLogout} className="menu-button" color="inherit">
                    Logout
                </Button>
            </Toolbar>
        </AppBar>
    )
    
}