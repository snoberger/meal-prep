import { Button, Dialog, DialogTitle, Grid, IconButton, TextField, Typography } from "@material-ui/core";
import CloseIcon from '@material-ui/icons/Close';
import "./DisplayRecipe.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { getComponentState, getDisplayRecipe, Recipe } from "../../../store/recipes/reducers/recipes";
import RecipeIngredientsList from "./RecipeIngredientsList";
import RecipeSteps from "./RecipeSteps";
import { editDisplayDescription, editDisplayName, handleCreateRecipe, handleEditRecipe, handleFetchRecipeList, setComponentState, handleDeleteRecipe } from "../../../store/recipes/actions/recipes";
import AddRecipeIngredient from "./AddRecipeIngredient/AddRecipeIngredient";
import AddRecipeStep from "./AddRecipeStep/AddRecipeStep";
import { Edit, Delete } from "@material-ui/icons";

interface IDisplayRecipeProps {
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
        editDisplayName: (name: string) => (dispatch(editDisplayName(name))),
        editDisplayDescription: (name: string) => (dispatch(editDisplayDescription(name))),
        handleCreateRecipe: (newRecipe: Recipe) => (dispatch(handleCreateRecipe(newRecipe))),
        handleEditRecipe: (userId: string, updatedRecipe: Recipe) => (dispatch(handleEditRecipe(userId, updatedRecipe))),
        fetchRecipeList: (userId: string) => (dispatch(handleFetchRecipeList(userId))),
        // handleDeleteRecipe: (userId: string, recipe: Recipe) => (dispatch(handleDeleteRecipe(userId, recipe))),
        handleDeleteRecipe: (index: number) => (dispatch(handleDeleteRecipe(index))),
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>
type DisplayRecipeCombinedProps = PropsFromRedux & IDisplayRecipeProps;

export class DisplayRecipe extends React.Component<DisplayRecipeCombinedProps, IDisplayRecipeState> {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSetEdit = this.handleSetEdit.bind(this);
        this.handleEditDisplayName = this.handleEditDisplayName.bind(this);
        this.handleEditDisplayDescription = this.handleEditDisplayDescription.bind(this);
        this.handleSetDelete = this.handleSetDelete.bind(this);
        this.handleClose = this.handleClose.bind(this);
    }
    handleEditDisplayName(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.editDisplayName(e.target.value);
    }

    handleEditDisplayDescription(e: React.ChangeEvent<HTMLInputElement>) {
        this.props.editDisplayDescription(e.target.value);
    }
    async handleSubmit() {
        if (this.props.recipe.ingredients.length !== 0 && this.props.recipe.steps.length !== 0) {
            if (this.props.componentState === 'edit') {
                await this.props.handleEditRecipe(this.props.auth.userId, this.props.recipe);
            } else if (this.props.componentState === 'add') {
                await this.props.handleCreateRecipe(this.props.recipe);
            } else if (this.props.componentState === 'delete') {
                await this.props.handleDeleteRecipe(1);
            }
            await this.props.fetchRecipeList(this.props.auth.userId);
            this.props.setComponentState('view');
        }
    }
    handleSetEdit() {
        this.props.setComponentState('edit');
    }
    handleSetDelete() {
        this.props.setComponentState('delete');
    }
    handleClose() {
        this.props.setComponentState('view');
    }
    render() {
        const ingredientsListProps = {
            ingredients: this.props.recipe.ingredients,
        };
        const recipeStepsProps = {
            steps: this.props.recipe.steps,
        };
        if (this.props.componentState === 'view') {
            return (
                <Grid container spacing={5} justify="center" className="display-recipe-container recipe-background">
                    <Grid item xs={6}>
                        <Typography variant="h6" className="display-recipe-title-text">
                            {this.props.recipe.name}
                            <IconButton style={{ float: 'right' }} onClick={this.handleSetDelete}><Delete /></IconButton>
                            <IconButton style={{ float: 'right' }} onClick={this.handleSetEdit}><Edit /></IconButton>
                        </Typography>
                        <Typography variant="body2" className="display-recipe-title-text">
                            {this.props.recipe.description}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <RecipeIngredientsList {...ingredientsListProps} />
                    </Grid>
                    <Grid item xs={12}>
                        <RecipeSteps {...recipeStepsProps} />
                    </Grid>
                </Grid>
            );
        } else if (this.props.componentState === 'edit' || this.props.componentState === 'add') {
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
                        <RecipeIngredientsList {...ingredientsListProps} />
                    </Grid>
                    <Grid item xs={12}>
                        <RecipeSteps {...recipeStepsProps} />
                    </Grid>
                    <Grid item xs={12}>
                        <Button onClick={this.handleSubmit}> Submit</Button>
                    </Grid>
                    <AddRecipeIngredient />
                    <AddRecipeStep stepLength={this.props.recipe.ingredients ? this.props.recipe.ingredients.length : 0} />
                </Grid>
            );
        }
        else if (this.props.componentState === 'delete') {
            return (
                <Dialog className="delete-recipe-dialog" aria-labelledby="addIngredient-dialog-title" open={this.props.componentState === 'delete'}>
                    <DialogTitle className="dialog-title" id="deleteRecipe-dialog-title">Are You Sure You Want to Delete this Recipe
                        <IconButton className="close-icon" aria-label="close" onClick={this.handleClose}>
                            <CloseIcon />
                        </IconButton>
                    </DialogTitle>
                    <Button onClick={this.handleSubmit} className="addingredient-button" color="primary">Confirm</Button>
                    <Button onClick={this.handleClose} className="addingredient-button" color="primary">No</Button>
                </Dialog>
            );
        }
        else {
            return (
                <div />
            );
        }

    }
}

export default connector(DisplayRecipe);
