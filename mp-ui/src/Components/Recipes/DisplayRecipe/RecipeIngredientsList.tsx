import { Card, CardContent, IconButton, List, ListItem, ListItemText, Typography } from "@material-ui/core";
import "./RecipeIngredientsList.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import { Add } from "@material-ui/icons";
import { State } from "../../../store/rootReducer";
import { getComponentState } from "../../../store/recipes/reducers/recipes";
import { toggleAddRecipeIngredientDialogue } from "../../../store/recipes/actions/recipes";

interface IRecipeIngredientsListProps {
    ingredients: Array<Ingredient>,
    componentState: string
}

interface IRecipeIngredientsListState {
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
        toggleAddIngredientDialogue: () => dispatch(toggleAddRecipeIngredientDialogue()),
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
        let listItemElements: Array<any> = [];
        console.log(this.props.ingredients)
        this.props.ingredients.forEach((ingredient:Ingredient)=> {
            listItemElements.push(
                <ListItem key={ingredient.name + 'item'} className="ingredient-list-item">
                    <ListItemText 
                        primary={
                                <React.Fragment>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                        className="primary-list-text"
                                    >
                                        {`${ingredient.amount} ${ingredient.metric}`}
                                    </Typography>
                                    {/* <Typography 
                                        component="span"
                                        variant="body2"
                                        color="textPrimary"
                                        className="period-styling">{periodString}</Typography> */}
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
        if(this.props.componentState === 'view'){
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
        } else if(this.props.componentState === 'edit' || this.props.componentState === 'add') {
            listItemElements.push(
                <ListItem key={'add-item'} className="ingredient-list-item">
                    <IconButton onClick={this.props.toggleAddIngredientDialogue}><Add/></IconButton>
                </ListItem>)
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
        
}

export default connector(RecipeIngredientsList);
