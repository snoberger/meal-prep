import { AppBar, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import React from 'react';
import { NavLink, RouteComponentProps, withRouter } from "react-router-dom";
import { AppScreens } from "../../Routes";
import './Navbar.css';



interface INavbarProps extends RouteComponentProps<any> {
}

interface INavbarState {
    anchorEl: any;
}


class Navbar extends React.Component<INavbarProps,INavbarState> {


    constructor(props: any) {
        super(props);
        this.onLogout = this.onLogout.bind(this);
        this.handleMenuClick = this.handleMenuClick.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = { anchorEl: null };
    }

    onLogout() {
        sessionStorage.removeItem("token");
        this.setState({anchorEl: null});
    }
    handleMenuClick(event: React.MouseEvent<HTMLButtonElement>) {
        this.setState({anchorEl: event.currentTarget});
    }
    handleClose() {
        this.setState({anchorEl: null});
    }

    render() {
        let displayButtons = true;
        let buttonList;
        let currentPath;
        if(this.props.history) {
            currentPath = this.props.history.location.pathname;
        }
        

        if(currentPath === "/login" || currentPath === "/signup") {
           displayButtons = false;
        }
        buttonList = ( <div id="button-list">
            <Button id="home-button" component={NavLink} to={AppScreens.HOME} activeClassName="active-button" className="menu-button" color="inherit">
                Home
            </Button>
            <Button id="cook-button" component={NavLink} to={AppScreens.COOK} activeClassName="active-button" className="menu-button" color="inherit">
                Cook
            </Button>
            <Button id="recipe-button" component={NavLink} to={AppScreens.RECIPES} activeClassName="active-button" className="menu-button" color="inherit">
                RECIPES
            </Button>
            <Button id="pantry-button"component={NavLink} to={AppScreens.PANTRY} activeClassName="active-button" className="menu-button" color="inherit">
                PANTRY
            </Button>
            <Button id="calendar-button"component={NavLink} to={AppScreens.CALENDAR} activeClassName="active-button" className="menu-button" color="inherit">
                CALENDAR
            </Button>
            <IconButton id="icon-button" onClick={this.handleMenuClick} className="menu-button" aria-controls="profile-menu">
                <AccountCircleIcon color="secondary"/>
            </IconButton>
            <Menu
                id="profile-menu"
                anchorEl={this.state.anchorEl}
                keepMounted
                open={Boolean(this.state.anchorEl)}
                onClose={this.handleClose}
            >
                <MenuItem id="profile-button" component={NavLink} to={AppScreens.PROFILE} onClick={this.handleClose}>Profile</MenuItem>
                <MenuItem id="logout-button"  component={NavLink} to={AppScreens.LOGIN} onClick={this.onLogout}>Logout</MenuItem>
             </Menu>
        </div>);

        return (
            <AppBar position="static">
                <Toolbar>
                <Typography variant="h6" className="title">
                    Pre-Prep Meal Prep
                </Typography>
                    {displayButtons ? buttonList : []}
                    
                </Toolbar>
            </AppBar>
        );
    }
    
}

export default withRouter(Navbar);