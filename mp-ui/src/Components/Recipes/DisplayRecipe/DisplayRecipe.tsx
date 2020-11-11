import { Grid, Typography } from "@material-ui/core";
import "./DisplayRecipe.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { getDisplayRecipe } from "../../../store/recipes/reducers/recipes";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeSteps from "./RecipeSteps";

interface IDisplayRecipeProps  {
}

interface IDisplayRecipeState {
    selectedIndex: null | number;
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, /*ownProps: any*/) => {
    return {
        ...state,
        recipe: getDisplayRecipe(state)
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (/*dispatch: any*/) => {
    return {
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type DisplayRecipeCombinedProps = PropsFromRedux & IDisplayRecipeProps;

export class DisplayRecipe extends React.Component<DisplayRecipeCombinedProps,IDisplayRecipeState> {
    render() {
        const ingredientsListProps ={
            ingredients: this.props.recipe.ingredients
        };
        const recipeStepsProps ={
            steps: this.props.recipe.steps
        };
        if(this.props.recipe && this.props.recipe.id !== undefined){
            return (
                <Grid container xs={12} spacing={5} justify="center" className="display-recipe-container recipe-background">
                    <Grid item xs={7} justify={'flex-start'}>
                        <Typography variant="h6" className="display-recipe-title-text">
                            {this.props.recipe.name}  
                        </Typography>
                        <Typography variant="body2" className="display-recipe-title-text">
                            {this.props.recipe.description}  
                        </Typography>
                    </Grid>
                    <Grid item xs={5} justify={'flex-end'}>
                        <RecipeIngredientsList {...ingredientsListProps}/>
                    </Grid>
                    <Grid item xs={12}>
                        <RecipeSteps {...recipeStepsProps}/>
                    </Grid>
                </Grid>
            );
        } else {
            return (
                <div/>
            );
        }
        
    }
}

export default connector(DisplayRecipe);
