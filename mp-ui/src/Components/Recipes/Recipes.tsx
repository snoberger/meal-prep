import { Button, Grid, Paper, Typography } from "@material-ui/core";
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Recipes.css";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { State } from "../../store/rootReducer";
import { getCheckedList, getComponentState, getRecipeList } from "../../store/recipes/reducers/recipes";
import { handleFetchRecipeList } from "../../store/recipes/actions/recipes";
import { getUserId } from "../../store/auth/reducers/auth";
import RecipeNameList from "./RecipeNameList/RecipeNameList";
import DisplayRecipe from "./DisplayRecipe/DisplayRecipe";
import { AppScreens } from "../../Routes";

interface IRecipesProps extends RouteComponentProps<any> {

}

interface IRecipesState {
}

const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
        recipeList: getRecipeList(state),
        userId: getUserId(state),
        componentState: getComponentState(state),
        checkedList: getCheckedList(state),
    };
};

const mapDispatchToProps = (dispatch: any) => {
    return {
        fetchRecipeList: (userId: string)=> (dispatch(handleFetchRecipeList(userId)))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type RecipesCombinedProps = PropsFromRedux & IRecipesProps;

export class Recipes extends React.Component<RecipesCombinedProps,IRecipesState> {
    async componentDidMount () {
        await this.props.fetchRecipeList(this.props.userId);
    }
    render() {
        return (
            <Grid container justify="center" alignItems="center">
                <Grid 
                    item
                    container 
                    className="main-container" 
                    justify="center"
                    direction={'row'} 
                    xs={1}
                    spacing={0} 
                    alignItems="center"
                    >
                        <Grid item xs={12} align-items="flex-start" className="secondary-container">
                                <Typography variant="h6" className="recipe-title-text">
                                    My Recipes
                                </Typography>
                                <Paper className="recipe-container recipe-background"> 
                                    <div className="recipe-list recipe-background MuiPaper-rounded">
                                        <RecipeNameList recipeList={this.props.recipeList} userId={this.props.userId}/>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            className="start-cook"
                                            component={NavLink}
                                             to={AppScreens.COOK}
                                        >
                                            Send To Cook
                                        </Button>
                                    </div>
                                    
                                    <Paper className="recipe-display recipe-background" elevation={0}>
                                        <DisplayRecipe/>
                                    </Paper>
                                </Paper>
                               
                        </Grid>
                </Grid>
            </Grid>      
        );
    }
}


export default connector(withRouter(Recipes));