import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { handleEditPantry, toggleEditIngredientDialogue } from "../../../../store/pantry/actions/pantry";
import { State } from "../../../../store/rootReducer";
import { Button, Card, CardContent, Dialog, DialogTitle, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Ingredient, getEditIngredientDialogueOpen } from '../../../../store/pantry/reducers/pantry';
import "../AddIngredient.css";

export interface IEditIngredientProps {

}


export interface IEditIngredientState {
    index: number;
    name: string;
    amount: string;
    metric: string;
    isNameValid: boolean;
    isAmountValid: boolean;
    isMetricValid: boolean;
}

const mapStateToProps = (state: State /*, ownProps*/) => ({
    ...state,
    open: getEditIngredientDialogueOpen(state),
    currentIngredient: state.pantry.currentIngredient
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleEditIngredientDialogue: () => dispatch(toggleEditIngredientDialogue({ index: -1, name: '', amount: '', metric: '' })),
        handleEditIngredient: (userId: string, pantryId: string, ingredients: Ingredient[], newIngredient: Ingredient) => dispatch(handleEditPantry(userId, pantryId, ingredients, newIngredient))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);

type PropsFromRedux = ConnectedProps<typeof connector>
type EditIngredientCombinedProps = PropsFromRedux & IEditIngredientProps;

const initialState = {
    index: -1,
    name: '',
    amount: '',
    metric: '',
    isNameValid: true,
    isAmountValid: true,
    isMetricValid: true,
};

class EditIngredient extends React.Component<EditIngredientCombinedProps, IEditIngredientState> {

    constructor(props: any) {
        super(props);
        this.setName = this.setName.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.setMetric = this.setMetric.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = initialState;
    }
    
    componentDidUpdate(prevState: any) {
        if(prevState.currentIngredient.name !== this.props.currentIngredient.name) {
            this.setState({
                index: this.props.currentIngredient.index,
                name: this.props.currentIngredient.name,
                amount: this.props.currentIngredient.amount,
                metric: this.props.currentIngredient.metric,
                isNameValid: true,
                isAmountValid: true,
                isMetricValid: true
            });
        }
    }

    setName(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ name: e.target.value });
        this.setState({ isNameValid: true });
    }

    setAmount(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ amount: e.target.value });
        this.setState({ isAmountValid: true });
    }
    setMetric(e: React.ChangeEvent<HTMLInputElement>) {
        this.setState({ metric: e.target.value });
        this.setState({ isMetricValid: true });
    }

    async handleSubmit() {
        if (this.state.name === '') {
            await this.setState({ isNameValid: false });
        }
        if (this.state.amount === '') {
            await this.setState({ isAmountValid: false });
        }
        if (this.state.metric === '') {
            await this.setState({ isMetricValid: false });
        }
        if (this.state.isNameValid && this.state.isAmountValid && this.state.isMetricValid) {
            //Update ingredient
            var newIngredient: Ingredient = {
                index: this.state.index,
                name: this.state.name,
                amount: this.state.amount,
                metric: this.state.metric,
            };
            //Use newIngredient
            this.props.handleEditIngredient(
                this.props.auth.userId, 
                this.props.auth.pantryId, 
                this.props.pantry.pantry.ingredients, newIngredient);
            this.props.toggleEditIngredientDialogue();
            await this.setState(initialState);
        }

    }

    async handleClose() {
        this.props.toggleEditIngredientDialogue();
        await this.setState(initialState);
    }


    render() {
        return (
            <Dialog className="addingredient-dialog" aria-labelledby="addIngredient-dialog-title" open={this.props.open}>
                <DialogTitle className="dialog-title" id="addIngredient-dialog-title">Edit Ingredient
                <IconButton className="close-icon" aria-label="close" onClick={this.handleClose}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Card>
                    <form noValidate id="add-form" autoComplete="off">
                        <CardContent>
                            <TextField
                                id="name"
                                error={!this.state.isNameValid}
                                onChange={this.setName}
                                value={this.state.name}
                                multiline rowsMax={2}
                                className="addingredient-input"
                                label="Name"
                                variant="filled" />
                            <TextField
                                id="amount"
                                error={!this.state.isAmountValid}
                                onChange={this.setAmount}
                                value={this.state.amount}
                                multiline rowsMax={2}
                                className="addingredient-input"
                                label="Amount"
                                variant="filled" />
                            <TextField
                                id="metric"
                                error={!this.state.isMetricValid}
                                onChange={this.setMetric}
                                value={this.state.metric}
                                multiline rowsMax={2}
                                className="addingredient-input"
                                label="Metric"
                                helperText="Example: lb, oz, bag"
                                variant="filled" />
                        </CardContent>
                        <Button onClick={this.handleSubmit} className="addingredient-button" variant="contained" color="primary">Edit Ingredient</Button>
                    </form>
                </Card>
            </Dialog>
        );
    }
}


export default connector(EditIngredient);
