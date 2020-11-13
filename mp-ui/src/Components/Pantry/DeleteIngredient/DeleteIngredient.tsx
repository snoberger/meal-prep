import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { toggleDeleteIngredientDisplay, handleDeleteIngredient } from "../../../store/pantry/actions/pantry";
import { State } from "../../../store/rootReducer";
import { Button, Card, CardContent, Dialog, DialogTitle, IconButton, Paper, TextField } from '@material-ui/core';
import { Ingredient, getDeleteIngredientViewOpen } from '../../../store/pantry/reducers/pantry';
import "./DeleteIngredient.css";
import { Close, Delete, Done } from "@material-ui/icons";

interface IDeleteIngredientProps {

}


interface IDeleteIngredientState {
    index: number,
    name: string;
    amount: string;
    metric: string;
    // ingredChecked: boolean
}

const mapStateToProps = (state: State /*, ownProps*/) => ({
    ...state,
    open: getDeleteIngredientViewOpen(state),
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleDeleteIngredientDisplay: () => dispatch(toggleDeleteIngredientDisplay()),
        //I think where the checkbox over every item handling would happen
        handleDeleteIngredient: (userId: string, pantryId: string, ingredients: Ingredient[], deleteIngred: Ingredient) =>
            dispatch(handleDeleteIngredient(userId, pantryId, ingredients, deleteIngred))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);


type PropsFromRedux = ConnectedProps<typeof connector>
type DeleteIngredientCombinedProps = PropsFromRedux & IDeleteIngredientProps;

const initialState = {
    // ingredChecked: false
    index: -1,
    name: "",
    amount: "",
    metric: "",
};
class DeleteIngredient extends React.Component<DeleteIngredientCombinedProps, IDeleteIngredientState> {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = initialState;
    }

    async handleSubmit() {
        var deleteIngred: Ingredient = {
            index: this.state.index,
            name: this.state.name,
            amount: this.state.amount,
            metric: this.state.metric,
        }
        // this.props.handleDeleteIngredient(deletions);
        // if(this.state.ingredChecked){
        //     this.props.handleDeleteIngredient()
        // }
        this.props.handleDeleteIngredient(this.props.auth.userId,
            this.props.auth.pantryId,
            this.props.pantry.pantry.ingredients, deleteIngred);
        this.props.toggleDeleteIngredientDisplay();

        this.setState(initialState);

    }
    handleClose() {
        this.props.toggleDeleteIngredientDisplay();
    }

    render() {
        let button;
        if (!this.props.open) {
            button = <IconButton color="primary" className="delete-ingredient-icon" component="span" onClick={this.props.toggleDeleteIngredientDisplay}>
                <Delete fontSize="small" />
            </IconButton>;
        }
        else {
            button = <><IconButton color="primary" className="finish-delete-mode" component="span" onClick={this.handleSubmit}>
                <Done fontSize="small" />
            </IconButton>
                <IconButton color="primary" className="exit-delete-mode" component="span" onClick={this.handleClose}>
                    <Close fontSize="small" />
                </IconButton></>;
        }
        return (
            <Paper className="delete-button-paper">
                {button}
            </Paper>
        );
    }
}

export default connector(DeleteIngredient);