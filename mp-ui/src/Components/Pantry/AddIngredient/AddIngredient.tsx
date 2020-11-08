import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { toggleAddIngredientDialogue, handleCreateIngredient } from "../../../store/pantry/actions/pantry";
import { State } from "../../../store/rootReducer";
import { Button, Card, CardContent, Dialog, DialogTitle, IconButton, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { Ingredient, getAddIngredientDialogueOpen } from '../../../store/pantry/reducers/pantry';
import "./AddIngredient.css";

interface IAddIngredientProps {
  
}


interface IAddIngredientState {
    name: string;
    amount: string;
    metric: string;
    isNameValid: boolean;
    isAmountValid: boolean;
    isMetricValid: boolean;
}
const mapStateToProps = (state: State /*, ownProps*/) => ({
    ...state,
    open: getAddIngredientDialogueOpen(state),
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleAddIngredientDialogue: () => dispatch(toggleAddIngredientDialogue()),
        handleCreateIngredient: (ingredients: Ingredient) => dispatch(handleCreateIngredient(ingredients))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);


type PropsFromRedux = ConnectedProps<typeof connector>
type AddIngredientCombinedProps = PropsFromRedux & IAddIngredientProps;

const initialState = {
    name: '',
    amount: '',
    metric: '',
    isNameValid: true,
    isAmountValid: true,
    isMetricValid: true,
};

class AddIngredient extends React.Component<AddIngredientCombinedProps,IAddIngredientState> {
 
    
    constructor(props: any) {
        super(props);
        this.setName = this.setName.bind(this);
        this.setAmount = this.setAmount.bind(this);
        this.setMetric = this.setMetric.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);


        
        this.state = initialState;
        
    }

  setName(e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({name: e.target.value});
      this.setState({isNameValid: true});
  }

  setAmount(e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({amount: e.target.value});
      this.setState({isAmountValid: true});
  }
  setMetric(e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({metric: e.target.value});
      this.setState({isMetricValid: true});
  }
  
  async handleSubmit() {
      if(this.state.name === '') {
          await this.setState({isNameValid: false});
      }
      if(this.state.amount === '') {
          await this.setState({isAmountValid: false});
      }
      if(this.state.metric === '') {
          await this.setState({isMetricValid: false});
      }
      if(this.state.isNameValid && this.state.isAmountValid && this.state.isMetricValid) {
          //Update ingredient
          var newIngredient: Ingredient = {
              name: this.state.name,
              amount: this.state.amount,
              metric: this.state.metric,
          };
          //Use newIngredient
          this.props.handleCreateIngredient(newIngredient);
          this.props.toggleAddIngredientDialogue();
          
          this.setState(initialState);
      }
      
  }
  
  handleClose() {
      this.props.toggleAddIngredientDialogue();
  }


    render() {
        return (
            <Dialog className="addingredient-dialog" aria-labelledby="addIngredient-dialog-title" open={this.props.open}>
              <DialogTitle className="dialog-title" id="addIngredient-dialog-title">Add Ingredient  
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
                                  variant="filled"/>
                              <TextField 
                                  id="amount" 
                                  error={!this.state.isAmountValid} 
                                  onChange={this.setAmount} 
                                  value={this.state.amount}  
                                  multiline rowsMax={2} 
                                  className="addingredient-input" 
                                  label="Amount"  
                                  variant="filled"/>
                              <TextField 
                                  id="metric"
                                  error={!this.state.isMetricValid}
                                  onChange={this.setMetric} 
                                  value={this.state.metric}  
                                  multiline rowsMax={2} 
                                  className="addingredient-input" 
                                  label="Metric"
                                  helperText="Example: lb, oz, bag"  
                                  variant="filled"/>
                        </CardContent>
                        <Button onClick={this.handleSubmit} className="addingredient-button" variant="contained" color="primary">Add Ingredient</Button>
                    </form>
                  </Card>
            </Dialog>
          );
    }
}


export default connector(AddIngredient);
