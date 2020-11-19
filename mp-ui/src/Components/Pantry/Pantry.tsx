import { Grid, Paper, Typography } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Pantry.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { getIngredients } from '../../store/pantry/reducers/pantry';
import { State } from "../../store/rootReducer";
import Closet from "./Closet/Closet";
import AddIngredient from "./AddEditIngredient/AddIngredient/AddIngredient";
import EditIngredient from "./AddEditIngredient/EditIngredient/EditIngredient";
import { handleFetchPantry } from "../../store/pantry/actions/pantry";
import { getPantryId, getUserId } from "../../store/auth/reducers/auth";

interface IPantryProps extends RouteComponentProps<any> {
}

interface IPantryState {
}

// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
        ingredients: getIngredients(state),
        userId: getUserId(state),
        pantryId: getPantryId(state)
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
        handleFetchPantry: (userId: string, pantryId: string) => (dispatch(handleFetchPantry(userId, pantryId)))
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type PantryCombinedProps = PropsFromRedux & IPantryProps;

export class Pantry extends React.Component<PantryCombinedProps,IPantryState> {
    async componentDidMount () {
        await this.props.handleFetchPantry(this.props.userId, this.props.pantryId);
    }
    render() {
      return (
        <Grid container justify="center" alignItems="center">
            <AddIngredient ></AddIngredient>
            <EditIngredient ></EditIngredient>
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