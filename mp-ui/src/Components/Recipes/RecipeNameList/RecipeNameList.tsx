import { List, ListItem, ListItemIcon, ListItemText, Paper } from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { Recipe } from "../../../store/recipes/reducers/recipes";
import { Add } from "@material-ui/icons";
import { handleFetchRecipe } from "../../../store/recipes/actions/recipes";

interface IRecipeNameListProps  {
    recipeList: Array<Recipe>,
    userId: string
}

interface IRecipeNameListState {
    selectedIndex: null | number;
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        ...state,
        ownProps: ownProps
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
        displayRecipe: (userId: string, recipeId: string) => (dispatch(handleFetchRecipe(userId, recipeId)))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type RecipeNameListCombinedProps = PropsFromRedux & IRecipeNameListProps;

export class RecipeNameList extends React.Component<RecipeNameListCombinedProps,IRecipeNameListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedIndex: null
        };
    }
    handleClickListItem (index: number | null, id: string) {
            this.setState({selectedIndex: index});
            if(index !== null && id !== ''){
                this.props.displayRecipe(this.props.ownProps.userId, id);
            } else {
                //TODO: add recipe
                console.log("Add recipe")
            }
            
    }
    render() {
        let recipeListElements:Array<any> = [];
        this.props.recipeList.forEach((recipe, index) => {
            recipeListElements.push(
                <ListItem
                    key={`list${index}`}
                    button
                    selected={this.state.selectedIndex === index}
                    onClick={() => this.handleClickListItem(index, recipe.id)}>
                    <ListItemText primary={recipe.id} secondary={"This will be a description"}/>
                </ListItem>
            );
        });
        return (
            <Paper className="recipe-list-container recipe-background" elevation={0}>
                <List component="nav" aria-label="main mailbox folders">
                    {recipeListElements}
                    <ListItem
                        button
                        onClick={() => this.handleClickListItem(null, '')}>
                        <ListItemIcon >
                            <Add />
                        </ListItemIcon>
                        <ListItemText  primary="Add a Recipe" />
                    </ListItem>
                </List>
            </Paper>
        );
    }
}


export default connector(RecipeNameList);