import { Grid, Paper, Typography } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Pantry.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { getIngredients} from '../../store/pantry/reducers/pantry';
import { State } from "../../store/rootReducer";
import Closet from "./Closet/Closet";

interface IPantryProps extends RouteComponentProps<any> {
}

interface IPantryState {
}
const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
        ingredients: getIngredients(state)
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type PantryCombinedProps = PropsFromRedux & IPantryProps;

export class Pantry extends React.Component<PantryCombinedProps,IPantryState> {
    // constructor(props: any) {
    //     super(props);
    // }
    render() {
      return (
        <Grid container justify="center" alignItems="center">
            <Grid 
                item
                container 
                className="main-container" 
                justify="center"
                direction={'row'} 
                xs={8}
                spacing={0} 
                alignItems="flex-start"
                >
                    <Grid item xs={12} style={{height: "90%"}}>
                        <div style={{paddingLeft: "318px", height: "90%"}}>
                            <Paper className="pantry-title">
                                <Typography variant="h6" className="pantry-title-text">
                                    My Pantry
                                </Typography>
                            </Paper>
                            <Closet ingredients={this.props.ingredients}/>
                        </div>
                    </Grid>
              </Grid>
          </Grid>
        );
    }
}


export default connector(withRouter(Pantry));