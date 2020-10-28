import * as React from 'react';
import {Redirect, Route, RouteProps} from 'react-router';
import { getAuthToken } from './store/auth/reducers/auth';
import { connect, ConnectedProps  } from 'react-redux';

export interface PrivateRouteProps extends RouteProps {
}

interface stateProps {
  authToken: string
}

const mapStateToProps = (state: any ) => {
  return {
      authToken: getAuthToken(state),
    };
};
const connector = connect<stateProps>(
  mapStateToProps,
  {}
);

type PropsFromRedux = ConnectedProps<typeof connector>
type PrivateRouteCombinedProps = PropsFromRedux & PrivateRouteProps;

export class PrivateRoute extends Route<PrivateRouteCombinedProps> {
    render() {
        let isAuthenticated = this.props.authToken;
        if (isAuthenticated) {
            return <Route {...this.props} component={this.props.component}/>;
        } else {
            return <Redirect to={{pathname: '/login'}}/>;
        }
    }
}

export default connector(PrivateRoute);