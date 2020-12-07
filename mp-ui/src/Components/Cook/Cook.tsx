import {  Grid, Paper, Typography } from "@material-ui/core";
import { RouteComponentProps } from "react-router-dom";
import { withRouter } from "react-router";
import "./Cook.css";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { State } from "../../store/rootReducer";
import {
  CheckedRecipe,
  getCheckedList,
  getComponentState,
  getRecipeList,
  Recipe,
} from "../../store/recipes/reducers/recipes";
import {
  handleFetchRecipeBatch,
  handleFetchRecipeList,
} from "../../store/recipes/actions/recipes";
import { getUserId } from "../../store/auth/reducers/auth";
import RecipeNameList from "./RecipeNameList/RecipeNameList";
import DisplayRecipe from "./DisplayRecipe/DisplayRecipe";
import { getLocalCookRecipes, setLocalCookRecipes } from "../../storage";
import { Ingredient } from "../../store/pantry/reducers/pantry";
import { MergedRecipeIngredient, MergedRecipeStep, mergeIngredientLists, mergeStepsLists, OutputMergedRecipedStep } from "./helper";

interface IRecipesProps extends RouteComponentProps<any> {}

interface IRecipesState {
  checkedList: CheckedRecipe[];
  curRecipeList: Recipe[];
  curIngredientList: Ingredient[];
  curStepList: OutputMergedRecipedStep[];
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
    fetchRecipeList: (userId: string) =>
      dispatch(handleFetchRecipeList(userId)),
    fetchRecipeData: (userId: string, recipeIds: string[]) =>
      dispatch(handleFetchRecipeBatch(userId, recipeIds)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type RecipesCombinedProps = PropsFromRedux & IRecipesProps;

export class Recipes extends React.Component<
  RecipesCombinedProps,
  IRecipesState
> {
  constructor(props: RecipesCombinedProps) {
    super(props);

    this.state = {
      checkedList: [],
      curRecipeList: [],
      curIngredientList: [],
      curStepList: [],
    };
  }
  async componentDidMount() {
    await this.props.fetchRecipeList(this.props.userId);

    if (this.props.checkedList?.length > 0) {
      let checkedIds = this.props.checkedList
        .filter((item) => item.checked)
        .map((item) => item.id);
      await this.setupRecipeList(checkedIds);
    } else if( getLocalCookRecipes().length > 0) {
        let checkedIds = getLocalCookRecipes();
        await this.setupRecipeList(checkedIds);
    }
  }
  async componentDidUpdate() {
    if (this.props.checkedList?.length > 0) {
      let checkedIds = this.props.checkedList
        .filter((item) => item.checked)
        .map((item) => item.id);

      if (
        checkedIds.length !== getLocalCookRecipes().length ||
        checkedIds.some((id) => {
          return !getLocalCookRecipes().includes(id);
        })
      ) {
        await this.setupRecipeList(checkedIds);
      }
    }
  }
  setupRecipeList = async (checkedIds: string[]) => {
    setLocalCookRecipes(checkedIds);
    await this.props.fetchRecipeData(this.props.userId, checkedIds);
    const ingredientList: MergedRecipeIngredient[] = [];
    const stepList: MergedRecipeStep[] = [];
    const recipes = this.props.recipeList.filter((recipe) => {
      if (checkedIds.includes(recipe.id)) {
        ingredientList.push({
            ingredients: recipe.ingredients,
            recipeName: recipe.name
        });
        stepList.push({
            steps: recipe.steps,
            recipeName: recipe.name
        });
        return true;
      }
    });
    this.setState({
      curRecipeList: recipes,
      curIngredientList: mergeIngredientLists(ingredientList),
      curStepList: mergeStepsLists(stepList),
    });
  };
  render() {
    return (
      <Grid container justify="center" alignItems="center">
        <Grid
          item
          container
          className="main-container"
          justify="center"
          direction={"row"}
          xs={1}
          spacing={0}
          alignItems="center"
        >
          <Grid
            item
            xs={12}
            align-items="flex-start"
            className="secondary-container"
          >
            <Typography variant="h6" className="recipe-title-text">
              Recipies to cook
            </Typography>
            <Paper className="recipe-container recipe-background">
              <div className="recipe-list recipe-background MuiPaper-rounded">
                <RecipeNameList
                  recipeList={this.props.recipeList.filter((recipe) => {
                    return getLocalCookRecipes().includes(recipe.id);
                  })}
                  userId={this.props.userId}
                />
              </div>

              <Paper className="recipe-display recipe-background" elevation={0}>
                <DisplayRecipe
                  curStepList={this.state.curStepList}
                  curIngredientList={this.state.curIngredientList}
                  recipeList={this.state.curRecipeList}
                />
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    );
  }
}

export default connector(withRouter(Recipes));
