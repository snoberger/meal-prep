import { Grid } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Home.css";
import React from "react";

interface IHomeProps extends RouteComponentProps<any> {

}

interface IHomeState {
}


class Home extends React.Component<IHomeProps,IHomeState> {

    
    constructor(props: any) {
        super(props);

        this.state = {
        };
    }
    
    render() {
        return (
            <Grid container>
                <div>Home</div>
            </Grid>
        );
    }
  }

  export default withRouter(Home);