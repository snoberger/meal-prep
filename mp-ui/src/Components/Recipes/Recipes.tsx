import { Accordion, AccordionSummary, Grid, IconButton, Typography } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Recipes.css";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { State } from "../../store/rootReducer";
import Recipe from "../Recipe/Recipe";
import { Add } from "@material-ui/icons";
import { getRecipeList } from "../../store/recipes/reducers/recipes";
import { handleFetchRecipeList } from "../../store/recipes/actions/recipes";
import { getUserId } from "../../store/auth/reducers/auth";

interface IRecipesProps extends RouteComponentProps<any> {

}

interface IRecipesState {
}

const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
        recipeList: getRecipeList(state),
        userId: getUserId(state)
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

const makeRecipe = (recipe: any) => {
    return(
        <React.Fragment key={recipe.id}>
                <Typography variant="h2">
                    My Recipes
                </Typography>
                <Accordion style={{ backgroundColor: "#cbd3f6", margin: ' 10px 30px 0px 30px' }}>
                    <AccordionSummary>
                        <Typography variant="h5">{"Recipe 1"}</Typography>
                        
                    </AccordionSummary>                    
                    <Recipe recipeData={recipe} />
                </Accordion>
        </React.Fragment>
    );
};
const setupViewRecipes = (recipes: any[]) => {
    return recipes.map((recipe) => {
        return makeRecipe(recipe);
    });
};
export class Recipes extends React.Component<RecipesCombinedProps,IRecipesState> {
    async componentDidMount () {
        console.log(await this.props.fetchRecipeList(this.props.userId))
    }
    render() {
      return (
        <div>
              {/* {setupViewRecipes()} */}
              <Grid key="add" item xs={1} className="recipe-container">
                  <IconButton color="primary" className="add-recipe-icon" component="span">
                      <Add fontSize="large" />
                  </IconButton>
              </Grid>
        </div>
              
        );
    }
}


export default connector(withRouter(Recipes));