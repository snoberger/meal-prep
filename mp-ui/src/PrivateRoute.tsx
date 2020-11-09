import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import { connect, ConnectedProps  } from 'react-redux';
import { handleCheckAuthToken } from './store/auth/actions/auth';
import { getAuthToken } from './store/auth/reducers/auth';
import Loading from './Components/Loading';

export interface PrivateRouteProps extends RouteProps {
    exact?: boolean
}

const mapStateToProps = (state: any, ownProps: PrivateRouteProps ) => {
    return {
        ...state,
        ...ownProps,
        authToken: getAuthToken(state)
    };
};
const mapDispatchToProps = (dispatch: any ) => {
    return {
        checkAuthToken: () => dispatch(handleCheckAuthToken()),
    };
};
const connector = connect(
  mapStateToProps,
  mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>
type PrivateRouteCombinedProps = PropsFromRedux & PrivateRouteProps;

export class PrivateRoute extends Route<PrivateRouteCombinedProps> {

    constructor(props: any) {
        super(props);
        this.state = {
            loading: true
        };
    }

    async componentDidMount () {
        try{
            await this.props.checkAuthToken();
            this.setState({loading: false});
        } catch(e) {
            this.setState({loading: false});
        }
    }

    render() {
        let isAuthenticated = false;
        if(this.props.authToken) {
            isAuthenticated = true;
        }
        if (isAuthenticated && !this.state.loading) {
            return <Route {...this.props} component={this.props.component}/>;
        } else if(this.state.loading) {
            return <Loading></Loading>;
        } else {
            return <Redirect to={{pathname: '/login'}}/>;
        }
    }
}

export default connector(PrivateRoute);