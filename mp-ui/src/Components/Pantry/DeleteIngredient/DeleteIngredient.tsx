import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { toggleDeleteIngredientDisplay, handleDeleteIngredient } from "../../../store/pantry/actions/pantry";
import { State } from "../../../store/rootReducer";
import { Button, Card, CardContent, Dialog, DialogTitle, IconButton, Paper, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Ingredient, getDeleteIngredientViewOpen } from '../../../store/pantry/reducers/pantry';
import "./DeleteIngredient.css";
import { Close, Delete, Done } from "@material-ui/icons";

interface IDeleteIngredientProps {

}


interface IDeleteIngredientState {
    // id: string,
    // name: string;
    // amount: string;
    // metric: string;
}

const mapStateToProps = (state: State /*, ownProps*/) => ({
    ...state,
    open: getDeleteIngredientViewOpen(state),
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleDeleteIngredientDisplay: () => dispatch(toggleDeleteIngredientDisplay()),
        //I think where the checkbox over every item handling would happen
        handleDeleteIngredient: (ingredients: Ingredient) => dispatch(handleDeleteIngredient(ingredients))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);


type PropsFromRedux = ConnectedProps<typeof connector>
type DeleteIngredientCombinedProps = PropsFromRedux & IDeleteIngredientProps;

const initialState = {

};
class DeleteIngredient extends React.Component<DeleteIngredientCombinedProps, IDeleteIngredientState> {
    constructor(props: any) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = initialState;
    }

    async handleSubmit() {
        // var deletions
        // this.props.handleDeleteIngredient(deletions);
        this.props.toggleDeleteIngredientDisplay();

        this.setState(initialState);

    }
    handleClose() {
        this.props.toggleDeleteIngredientDisplay();
    }

    render() {
        let button;
        if (this.props.open) {
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