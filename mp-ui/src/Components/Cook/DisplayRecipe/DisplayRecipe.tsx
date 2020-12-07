import {
  Grid,
} from "@material-ui/core";
import "./DisplayRecipe.css";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { State } from "../../../store/rootReducer";
import {
  getComponentState,
  Recipe,
} from "../../../store/recipes/reducers/recipes";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeSteps from "./RecipeSteps";
import {
  handleFetchRecipeList
} from "../../../store/recipes/actions/recipes";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import { OutputMergedRecipedStep } from "../helper";

interface IDisplayRecipeProps {
  curRecipeList: Recipe[];
  curIngredientList: Ingredient[];
  curStepList: OutputMergedRecipedStep[];
}

interface IDisplayRecipeState {
  selectedIndex: null | number;
}
// this function will not run in test
/* istanbul ignore next */
 const mapStateToProps = (state: State, ownProps: any) => {
  return {
    ...state,
    ...ownProps,
    componentState: getComponentState(state),
  };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchRecipeList: (userId: string) =>
      dispatch(handleFetchRecipeList(userId)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type DisplayRecipeCombinedProps = PropsFromRedux & IDisplayRecipeProps;

export class DisplayRecipe extends React.Component<
  DisplayRecipeCombinedProps,
  IDisplayRecipeState
> {
  constructor(props: any) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async handleSubmit() {
    if (
      this.props.recipe.ingredients.length !== 0 &&
      this.props.recipe.steps.length !== 0
    ) {
      await this.props.fetchRecipeList(this.props.auth.userId);
    //   this.props.setComponentState("view");
    }
  }
  render() {
    return (
      <Grid
        container
        spacing={5}
        justify="center"
        className="display-recipe-container recipe-background"
      >
        <Grid item xs={6}>
          {/* <Typography variant="h6" className="display-recipe-title-text">
                            {this.props.recipe.name}  
                        </Typography>
                        <Typography variant="body2" className="display-recipe-title-text">
                            {this.props.recipe.description}  
                        </Typography> */}
        </Grid>
        <Grid item xs={6}>
          <RecipeIngredientsList
            {...{ ingredients: this.props.curIngredientList }}
          />
        </Grid>
        <Grid item xs={12}>
          <RecipeSteps {...{ steps: this.props.curStepList }} />
        </Grid>
      </Grid>
    );
  }
}

export default connector(DisplayRecipe);
