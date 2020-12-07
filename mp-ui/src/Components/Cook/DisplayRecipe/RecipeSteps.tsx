import {
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import {
  getComponentState,
} from "../../../store/recipes/reducers/recipes";
import {
  removeStepAtIndex,
  toggleAddRecipeStepDialogue,
} from "../../../store/recipes/actions/recipes";
import { State } from "../../../store/rootReducer";
import { OutputMergedRecipedStep } from "../helper";

interface IRecipeStepsProps {
  steps: Array<Ingredient>;
  componentState: string;
}

interface IRecipeStepsState {}
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
    removeStepAtIndex: (index: number) => dispatch(removeStepAtIndex(index)),
    toggleAddRecipeStepDialogue: () => dispatch(toggleAddRecipeStepDialogue()),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type RecipeStepsCombinedProps = PropsFromRedux & IRecipeStepsProps;

export class RecipeSteps extends React.Component<
  RecipeStepsCombinedProps,
  IRecipeStepsState
> {
  constructor(props: any) {
    super(props);
    this.handleRemoveStepAtIndex = this.handleRemoveStepAtIndex.bind(this);
  }
  handleRemoveStepAtIndex(index: number) {
    this.props.removeStepAtIndex(index);
  }
  render() {
    let listItemElements: Array<any> = [];
    listItemElements.push(<ListItem key={-1} className="recipe-list-item">
    <ListItemText
      primary={
        <React.Fragment>
          <Typography
            component="span"
            variant="h5"
            color="textPrimary"
            className="step-description-header"
          >
            {"Recipe Name"}
          </Typography>
        </React.Fragment>
      }
    />
    <ListItemText
      primary={
        <React.Fragment>
          <Typography
            component="span"
            variant="h5"
            color="textPrimary"
            className="step-description"
          >
            {"Instructions"}
          </Typography>
        </React.Fragment>
      }
    />
    <Typography
      component="span"
      variant="h5"
      color="textPrimary"
      style={{ float: "right" }}
    >
      {"Time"}
    </Typography>
  </ListItem>);
    this.props.steps.forEach((step: OutputMergedRecipedStep, index: number) => {
      listItemElements.push(
        <ListItem key={step.step.order + index} className="recipe-list-item">
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  className="step-description"
                >
                  {step.recipeName}
                </Typography>
              </React.Fragment>
            }
          />
          <ListItemText
            primary={
              <React.Fragment>
                <Typography
                  component="span"
                  variant="body2"
                  color="textPrimary"
                  className="step-description"
                >
                  {step.step.description}
                </Typography>
              </React.Fragment>
            }
          />
          <Typography
            component="span"
            variant="body2"
            color="textPrimary"
            style={{ float: "right" }}
          >
            {step.step.time}
          </Typography>
        </ListItem>
      );
    });
    return (
      <Card className="display-recipe-card">
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            Steps
          </Typography>
          <List>{listItemElements}</List>
        </CardContent>
      </Card>
    );
  }
}

export default connector(RecipeSteps);
