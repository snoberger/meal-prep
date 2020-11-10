import { Card, CardContent, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import "./RecipeIngredientsList.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { Ingredient } from "../../../store/pantry/reducers/pantry";

interface IRecipeIngredientsListProps {
    ingredients: Array<Ingredient>
}

interface IRecipeIngredientsListState {
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
type RecipeIngredientsListCombinedProps = PropsFromRedux & IRecipeIngredientsListProps;

export class RecipeIngredientsList extends React.Component<RecipeIngredientsListCombinedProps,IRecipeIngredientsListState> {
    render() {
        let periodString='';
        for(let i = 0; i < 100; i++){
            periodString += '.';
        }
        let listItemElements: Array<any> = [];
        this.props.ingredients.forEach((ingredient:Ingredient)=> {
            ingredient.metric = 'test';
            ingredient.name = 'name';
            listItemElements.push(
                <ListItem className="ingredient-list-item">
                    <ListItemText 
                        primary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                        className="primary-list-text"
                                    >
                                        {`${ingredient.amount} ${ingredient.metric}${periodString}`}
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
                    <List>
                        {listItemElements}
                    </List>
                </CardContent>
            </Card>
        );
    }
        
}

export default connector(RecipeIngredientsList);
