import { Card, CardContent, List, ListItem, ListItemIcon, ListItemText, Typography } from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import { RecipeStep } from "../../../store/recipes/reducers/recipes";
import CheckIcon from '@material-ui/icons/Check';

interface IRecipeStepsProps {
    steps: Array<Ingredient>
}

interface IRecipeStepsState {
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (/*state: State, */ownProps: any) => {
    return {
        ...ownProps
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
type RecipeStepsCombinedProps = PropsFromRedux & IRecipeStepsProps;

export class RecipeSteps extends React.Component<RecipeStepsCombinedProps,IRecipeStepsState> {
    render() {
        let listItemElements: Array<any> = [];
        this.props.steps.forEach((step:RecipeStep)=> {
            listItemElements.push(
                <ListItem className="recipe-list-item">
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
                                        className="primary-list-text"
                                    >
                                        {step.description}
                                    </Typography>
                                </React.Fragment>
                            }
                        secondary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                        style={{float: 'right'}}
                                    >
                                        {step.time}
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

export default connector(RecipeSteps);