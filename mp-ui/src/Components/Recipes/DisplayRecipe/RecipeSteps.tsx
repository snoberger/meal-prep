import { Card, CardContent, IconButton, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import { getComponentState, RecipeStep } from "../../../store/recipes/reducers/recipes";
import CheckIcon from '@material-ui/icons/Check';
import { Add } from "@material-ui/icons";
import { toggleAddRecipeStepDialogue } from "../../../store/recipes/actions/recipes";
import { State } from "../../../store/rootReducer";

interface IRecipeStepsProps {
    steps: Array<Ingredient>,
    componentState: string
}

interface IRecipeStepsState {
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        componentState: getComponentState(state),
        ...ownProps
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleAddRecipeStepDialogue: () => (dispatch(toggleAddRecipeStepDialogue()))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type RecipeStepsCombinedProps = PropsFromRedux & IRecipeStepsProps;

export class RecipeSteps extends React.Component<RecipeStepsCombinedProps,IRecipeStepsState> {
    render() {
        let listItemElements: Array<any> = [];
        this.props.steps.forEach((step:RecipeStep)=> {
            listItemElements.push(
                <ListItem key={step.order} className="recipe-list-item">
                    <ListItemIcon>
                        <CheckIcon/>
                    </ListItemIcon>
                    <ListItemText 
                        primary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                        className="step-description"
                                    >
                                        {step.description}
                                    </Typography>
                                </React.Fragment>
                            }
                    />
                    <Typography
                        component="span"
                        variant="body2"
                        color="textPrimary"
                        style={{float: 'right'}}
                    >
                        {step.time}
                    </Typography>
                </ListItem>
                );
        });
        if(this.props.componentState === 'view'){
            return (
                <Card className="display-recipe-card">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Steps
                        </Typography>
                        <List>
                            {listItemElements}
                        </List>
                    </CardContent>
                </Card>
            );
        } else {
            listItemElements.push(
                <ListItem key={'add-item'} className="ingredient-list-item">
                    <IconButton onClick={this.props.toggleAddRecipeStepDialogue}><Add/></IconButton>
                </ListItem>)
            return (
                <Card className="display-recipe-card">
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            Steps
                        </Typography>
                        <List>
                            {listItemElements}
                        </List>
                    </CardContent>
                </Card>
            );
        }
        
    }
        
}

export default connector(RecipeSteps);