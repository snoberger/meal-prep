import { Checkbox, Hidden, List, ListItem, ListItemIcon, ListItemSecondaryAction, ListItemText, Paper } from "@material-ui/core";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { CheckedRecipe, getCheckedList, Recipe } from "../../../store/recipes/reducers/recipes";
import { Add } from "@material-ui/icons";
import './RecipeNameList.css';
import { handleFetchRecipe, setComponentState, updateCheckedList } from "../../../store/recipes/actions/recipes";

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
        updateCheckedList: (checkedList: Array<CheckedRecipe>) => (dispatch(updateCheckedList(checkedList)))
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

    componentDidUpdate(prevProps: IRecipeNameListProps) {
        if(prevProps.recipeList !== this.props.recipeList) {
            let newList = [];
            for(const r of this.props.recipeList) {
                const newChecked = {"id": r.id, "checked": false};
                newList.push(newChecked);
            }
            this.props.updateCheckedList(newList);
            this.setState({loadCheckedList: true});
        }
        
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

    handleCheckBox(id: String) {
        const newList = this.props.checkedList.map((recipe) => {
            if(recipe.id === id) {
                return {"id": recipe.id, "checked": !recipe.checked};
            }
            return recipe;
        });
        this.props.updateCheckedList(newList);
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
                    <ListItemText primary={recipe.name} secondary={recipe.description}/>
                    <ListItemSecondaryAction>
                        <Hidden>
                            <Checkbox
                                edge="end"
                                color="primary"
                                onChange={() => this.handleCheckBox(recipe.id)}
                                checked={this.props.checkedList[index] ? this.props.checkedList[index].checked : false}
                                // inputProps={{ 'aria-labelledby': labelId }}
                            />
                        </Hidden>
                    </ListItemSecondaryAction>
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