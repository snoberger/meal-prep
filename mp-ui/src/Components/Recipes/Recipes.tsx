import { Accordion, AccordionSummary, Grid, IconButton, Typography } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Recipes.css";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { State } from "../../store/rootReducer";
import Recipe from "../Recipe/Recipe";
import { Add } from "@material-ui/icons";


const testRecipes = [
    {
        id: 'recipeId',
        steps:[
            "Step1",
            "Step2"
        ],
        ingredients: [
            {
                name: "ingred1",
                amount: 1,
                metric: 'mL'
            },
            {
                name: "ingred2",
                amount: 5,
                metric: 'mL'
            }
        ]

    }
];
interface IRecipesProps extends RouteComponentProps<any> {

}

interface IRecipesState {
}

const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
    };
};

const connector = connect(
    mapStateToProps
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
    render() {
      return (
        <div>
              {setupViewRecipes(testRecipes)}
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