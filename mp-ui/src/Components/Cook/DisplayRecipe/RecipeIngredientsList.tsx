import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  TextField,
  Typography,
} from "@material-ui/core";
import "./RecipeIngredientsList.css";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import { State } from "../../../store/rootReducer";
import { getComponentState } from "../../../store/recipes/reducers/recipes";
import {
  removeIngredientAtIndex,
  toggleAddRecipeIngredientDialogue,
} from "../../../store/recipes/actions/recipes";

interface IRecipeIngredientsListProps {
  ingredients: Array<Ingredient>;
  componentState: string;
}

interface IRecipeIngredientsListState {}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, ownProps: any) => {
  return {
    componentState: getComponentState(state),
    ...ownProps,
  };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
  return {
    removeIngredientAtIndex: (index: number) =>
      dispatch(removeIngredientAtIndex(index)),
    toggleAddIngredientDialogue: () =>
      dispatch(toggleAddRecipeIngredientDialogue()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type RecipeIngredientsListCombinedProps = PropsFromRedux &
  IRecipeIngredientsListProps;

export class RecipeIngredientsList extends React.Component<
  RecipeIngredientsListCombinedProps,
  IRecipeIngredientsListState
> {
  constructor(props: any) {
    super(props);
    this.handleRemoveIngredientAtIndex = this.handleRemoveIngredientAtIndex.bind(
      this
    );
  }
  handleRemoveIngredientAtIndex(index: number) {
    this.props.removeIngredientAtIndex(index);
  }
  render() {
    let listItemElements: Array<any> = [];
    this.props.ingredients?.forEach((ingredient: Ingredient) => {
      listItemElements.push(
        <ListItem
          key={ingredient.name + "item"}
          className="ingredient-list-item"
        >
          <ListItemText
          aria-multiline='true'
            primary={
              <React.Fragment>
                <ListItemText
                  primary={<TextField 
                    multiline rows={0} 
                    value={ingredient.amount} />}
                  secondary={`${ingredient.metric}`}
                  color="textPrimary"
                //   className="primary-list-text"
                >
                  {/* {`${ingredient.amount} ${ingredient.metric}`} */}
                </ListItemText>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  className="secondary-list-text"
                >
                  {ingredient.name}
                </Typography>
              </React.Fragment>
            }
          />
        </ListItem>
      );
    });
    return (
      <Card className="display-recipe-card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Ingredients
          </Typography>
          <List>{listItemElements}</List>
        </CardContent>
      </Card>
    );
  }
}

export default connector(RecipeIngredientsList);
