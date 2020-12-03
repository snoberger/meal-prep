import { Hidden, IconButton, List, ListItem, ListItemIcon, ListItemText, Paper } from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { Recipe } from "../../../store/recipes/reducers/recipes";
import { Add, Delete } from "@material-ui/icons";
import './RecipeNameList.css';
import { removeRecipeAtIndex, handleFetchRecipe, setComponentState } from "../../../store/recipes/actions/recipes";

interface IRecipeNameListProps {
    recipeList: Array<Recipe>,
    userId: string
}

interface IRecipeNameListState {
    selectedIndex: null | number;
    setIsShown: boolean;
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
        displayRecipe: (userId: string, recipeId: string) => (dispatch(handleFetchRecipe(userId, recipeId))),
        removeRecipeAtIndex: (index: number) => (dispatch(removeRecipeAtIndex(index))),
        setComponentState: (componentState: string) => (dispatch(setComponentState(componentState)))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>
type RecipeNameListCombinedProps = PropsFromRedux & IRecipeNameListProps;

export class RecipeNameList extends React.Component<RecipeNameListCombinedProps, IRecipeNameListState> {
    constructor(props: any) {
        super(props);
        this.state = {
            selectedIndex: null,
            setIsShown: true
        };
        this.handleRemoveRecipeAtIndex = this.handleRemoveRecipeAtIndex.bind(this);
    }
    handleClickListItem(index: number | null, id: string) {
        this.setState({ selectedIndex: index });
        if (index !== null && id !== '') {
            this.props.setComponentState('view');
            this.props.displayRecipe(this.props.ownProps.userId, id);
        } else {
            this.props.setComponentState('add');
        }

    }
    handleRemoveRecipeAtIndex(index: number) {
        this.props.setComponentState('view');
        this.props.removeRecipeAtIndex(index);
    }
    render() {
        let recipeListElements: Array<any> = [];
        this.props.recipeList.forEach((recipe, index) => {
            recipeListElements.push(
                <ListItem
                    key={`list${index}`}
                    button
                    selected={this.state.selectedIndex === index}
                    onMouseEnter={() => this.setState({ setIsShown: false })}
                    onMouseLeave={() => this.setState({ setIsShown: true })}>
                    <ListItemText primary={recipe.name} secondary={recipe.description}
                        onClick={() => this.handleClickListItem(index, recipe.id)} />
                    <Hidden xsUp={this.state.setIsShown}>
                        <IconButton onClick={() => (this.handleRemoveRecipeAtIndex(index))}><Delete /></IconButton>
                    </Hidden>
                </ListItem>
            );
        });
        return (
            <Paper className="recipe-list-container recipe-background" elevation={0}>
                <List component="nav" className="name-list" aria-label="main mailbox folders">
                    {recipeListElements}
                    <ListItem
                        button
                        onClick={() => this.handleClickListItem(null, '')}>
                        <ListItemIcon>
                            <Add />
                        </ListItemIcon>
                        <ListItemText primary="Add a Recipe" />
                    </ListItem>
                </List>
            </Paper>
        );
    }
}


export default connector(RecipeNameList);