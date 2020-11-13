import { Button, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import "./DisplayRecipe.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { getComponentState, getDisplayRecipe, Recipe } from "../../../store/recipes/reducers/recipes";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeSteps from "./RecipeSteps";
import { editDisplayDescription, editDisplayName, handleCreateRecipe, handleEditRecipe, handleFetchRecipeList, setComponentState } from "../../../store/recipes/actions/recipes";
import AddRecipeIngredient from "./AddRecipeIngredient/AddRecipeIngredient";
import AddRecipeStep from "./AddRecipeStep/AddRecipeStep";
import { Edit } from "@material-ui/icons";

interface IDisplayRecipeProps  {
}

interface IDisplayRecipeState {
    selectedIndex: null | number;
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, /*ownProps: any*/) => {
    return {
        ...state,
        recipe: getDisplayRecipe(state),
        componentState: getComponentState(state)
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
        setComponentState: (componentState: string) => (dispatch(setComponentState(componentState))),
        editDisplayName: (name: string)=> (dispatch(editDisplayName(name))),
        editDisplayDescription: (name: string)=> (dispatch(editDisplayDescription(name))),
        handleCreateRecipe: (newRecipe: Recipe) => (dispatch(handleCreateRecipe(newRecipe))),
        handleEditRecipe: (userId: string, updatedRecipe: Recipe) => (dispatch(handleEditRecipe(userId, updatedRecipe))),
        fetchRecipeList: (userId: string)=> (dispatch(handleFetchRecipeList(userId)))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type DisplayRecipeCombinedProps = PropsFromRedux & IDisplayRecipeProps;

export class DisplayRecipe extends React.Component<DisplayRecipeCombinedProps,IDisplayRecipeState> {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSetEdit = this.handleSetEdit.bind(this); 
        this.handleEditDisplayName = this.handleEditDisplayName.bind(this); 
        this.handleEditDisplayDescription = this.handleEditDisplayDescription.bind(this); 
    }
    handleEditDisplayName(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.editDisplayName(e.target.value);
    }
  
    handleEditDisplayDescription(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.editDisplayDescription(e.target.value);
    }
    async handleSubmit() {
        if(this.props.componentState === 'edit'){
            await this.props.handleEditRecipe(this.props.auth.userId, this.props.recipe)
        } else if(this.props.componentState === 'add') {
            await this.props.handleCreateRecipe(this.props.recipe)
        }
        await this.props.fetchRecipeList(this.props.auth.userId);
        this.props.setComponentState('view')
    }
    handleSetEdit() {
        this.props.setComponentState('edit')
    }
    render() {
        const ingredientsListProps ={
            ingredients: this.props.recipe.ingredients,
        };
        const recipeStepsProps ={
            steps: this.props.recipe.steps,
        };
        if(this.props.componentState === 'view'){
            return (
                <Grid container spacing={5} justify="center" className="display-recipe-container recipe-background">
                    <Grid item xs={6}>
                        <Typography variant="h6" className="display-recipe-title-text">
                            {this.props.recipe.name}  
                            <IconButton style={{float: 'right'}}onClick={this.handleSetEdit}><Edit/></IconButton>
                        </Typography>
                        <Typography variant="body2" className="display-recipe-title-text">
                            {this.props.recipe.description}  
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <RecipeIngredientsList {...ingredientsListProps}/>
                    </Grid>
                    <Grid item xs={12}>
                        <RecipeSteps {...recipeStepsProps}/>
                    </Grid>
                </Grid>
            );
        } else if(this.props.componentState === 'edit' || this.props.componentState === 'add'){
            return (
                <Grid container spacing={5} justify="center" className="display-recipe-container recipe-background">
                    <Grid item xs={6}>
                        <TextField
                            label="Name"
                            className='name-field'
                            onChange={this.handleEditDisplayName}
                            value={this.props.recipe.name}
                            variant="outlined"
                        />
                        <TextField
                            label="Description"
                            className='description-field'
                            multiline
                            onChange={this.handleEditDisplayDescription}
                            rows={4}
                            value={this.props.recipe.description}
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <RecipeIngredientsList {...ingredientsListProps}/>
                    </Grid>
                    <Grid item xs={12}>
                        <RecipeSteps {...recipeStepsProps}/>
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={this.handleSubmit}> Submit</Button>
                    </Grid>
                    <AddRecipeIngredient/>
                    <AddRecipeStep stepLength={this.props.recipe.ingredients ? this.props.recipe.ingredients.length: 0} />
                </Grid>
            );
        } else {
            return (
                <div/>
            );
        }
        
    }
}

export default connector(DisplayRecipe);
