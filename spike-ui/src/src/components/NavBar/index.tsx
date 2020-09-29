import React from 'react';
import { useLocation } from 'react-router';
import { Link } from 'react-router-dom';
import { AppScreens } from '../../App';
import './styles.css';

export default class NavBar extends React.Component<{}, {}>{
    onHome = () => {

    }
    onProfile = () => {

    }
    onLogout = () => {

    }
    render() {
        return (
            <div className='bar'>
                <Link className="button" to={AppScreens.HOME} style={{ textDecoration: 'none' }}>
                    <div>
                        Home
                    </div>
                </Link>
                <Link className="button" to={AppScreens.PROFILE} style={{ textDecoration: 'none' }}>
                    <div>
                        Profile
                    </div>
                </Link>
                <Link className="button" to={AppScreens.LOGIN} style={{ textDecoration: 'none' }}>
                    <div>
                        Logout
                    </div>
                </Link>
            </div>
        );
    }
}