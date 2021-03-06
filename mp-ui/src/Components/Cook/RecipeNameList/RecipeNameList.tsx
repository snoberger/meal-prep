import {  List, ListItem, ListItemText, Paper } from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import {  getCheckedList, Recipe } from "../../../store/recipes/reducers/recipes";
import './RecipeNameList.css';
import { handleFetchRecipe, setComponentState } from "../../../store/recipes/actions/recipes";

interface IRecipeNameListProps  {
    recipeList: Array<Recipe>,
    userId: string
}

interface IRecipeNameListState {
    selectedIndex: null | number,
    loadCheckedList: boolean,
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        ...state,
        checkedList: getCheckedList(state),
        ownProps: ownProps
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
        displayRecipe: (userId: string, recipeId: string) => (dispatch(handleFetchRecipe(userId, recipeId))),
        setComponentState: (componentState: string) => (dispatch(setComponentState(componentState))),
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
            selectedIndex: null,
            loadCheckedList: false
        };
          
    }


    handleClickListItem (index: number | null, id: string) {
            this.setState({selectedIndex: index});
            if(index !== null && id !== ''){
                this.props.setComponentState('view');
                this.props.displayRecipe(this.props.ownProps.userId, id);
            } else {
                this.props.setComponentState('add');
            }
            
    }
    render() {
        
        let recipeListElements:Array<any> = [];
        this.props.recipeList.forEach((recipe, index) => {
            recipeListElements.push(
                <ListItem
                    disabled
                    key={`list${index}`}
                    button
                    selected={this.state.selectedIndex === index}
                    onClick={() => this.handleClickListItem(index, recipe.id)}>
                    <ListItemText primary={recipe.name} secondary={recipe.description}/>
                </ListItem>
            );
        });
        return (
            <Paper className="recipe-list-container recipe-background" elevation={0}>
                <List component="nav" className="name-list" aria-label="main mailbox folders">
                    {recipeListElements}
                </List>
              
            </Paper>
            
        );
    }
}


export default connector(RecipeNameList);