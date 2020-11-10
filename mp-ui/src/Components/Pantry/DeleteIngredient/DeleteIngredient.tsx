import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { toggleDeleteIngredientDisplay, handleDeleteIngredient } from "../../../store/pantry/actions/pantry";
import { State } from "../../../store/rootReducer";
import { Button, Card, CardContent, Dialog, DialogTitle, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Ingredient, getDeleteIngredientViewOpen } from '../../../store/pantry/reducers/pantry';
import "./DeleteIngredient.css";

interface IDeleteIngredientProps {

}


interface IDeleteIngredientState {

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

        this.state = initialState;
    }

    async handleSubmit() {
        this.props.toggleDeleteIngredientDisplay();

    }

}
