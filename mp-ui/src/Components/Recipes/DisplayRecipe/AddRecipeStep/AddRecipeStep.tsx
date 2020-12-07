import React from "react";
import { connect, ConnectedProps } from "react-redux";
import { toggleAddRecipeStepDialogue, addStepDisplay } from "../../../../store/recipes/actions/recipes";
import { State } from "../../../../store/rootReducer";
import { Button, Card, CardContent, Dialog, DialogTitle, IconButton, MenuItem, Select, TextField } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { getAddRecipeStepDialogueOpen } from '../../../../store/recipes/reducers/recipes';
import { RecipeStep } from "../../../../store/recipes/reducers/recipes";

export interface IAddRecipeStepProps {
    stepLength: number
}


export interface IAddRecipeStepState {
    description: string;
    type: string;
    resources: string[];
    time: string;
    isDescriptionValid: boolean;
    isTypeValid: boolean;
    isTimeValid: boolean;

}
const mapStateToProps = (state: State, ownProps: IAddRecipeStepProps) => ({
    ...state,
    ...ownProps,
    open: getAddRecipeStepDialogueOpen(state),
});

const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleAddRecipeStepDialogue: () => dispatch(toggleAddRecipeStepDialogue()),
        addStepDisplay: (step: RecipeStep) => dispatch(addStepDisplay(step))
    };
};

const connector = connect(
    mapStateToProps,
    mapDispatchToProps,
);


type PropsFromRedux = ConnectedProps<typeof connector>
type AddRecipeStepCombinedProps = PropsFromRedux & IAddRecipeStepProps;

const initialState = {
    description: '',
    type: '',
    resources: [],
    time: '',
    isDescriptionValid: true,
    isTypeValid: true,
    isTimeValid: true,
};

export class AddRecipeStep extends React.Component<AddRecipeStepCombinedProps,IAddRecipeStepState> {
 
    constructor(props: any) {
        super(props);
        this.setDescription = this.setDescription.bind(this);
        this.setType = this.setType.bind(this);
        this.setResources = this.setResources.bind(this);
        this.setTime = this.setTime.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = initialState;   
    }

  setDescription(e: React.ChangeEvent<HTMLInputElement>) {
      this.setState({description: e.target.value});
      this.setState({isDescriptionValid: true});
  }

  setType(e: React.ChangeEvent<{
      name?: string | undefined;
      value: any;
    }>) {
        // eslint-disable-next-line
      this.setState({type: e.target.value});
      this.setState({isTypeValid: true});
  }
  
  setResources(e: React.ChangeEvent<{
      name?: string | undefined;
      value: any;
    }>) {
      this.setState({resources: e.target.value});
  }

  setTime(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({time: e.target.value});
    this.setState({isTimeValid: true});
  }
  
  async handleSubmit() {
      if(this.state.description === '') {
          await this.setState({isDescriptionValid: false});
      }
      if(this.state.type === '') {
          await this.setState({isTypeValid: false});
      }
      if(this.state.time === '') {
        await this.setState({isTimeValid: false});
      }
      if(this.state.isDescriptionValid && this.state.isTypeValid && this.state.isTimeValid) {
          this.props.addStepDisplay({
              description: this.state.description, 
              type: this.state.type, 
              resources: this.state.resources,
              time: this.state.time,
              order: (this.props.stepLength + "")});
          this.props.toggleAddRecipeStepDialogue();
          
          this.setState(initialState);
      }
      
  }
  
  handleClose() {
      this.props.toggleAddRecipeStepDialogue();
  }


    render() {
        return (
            <Dialog className="addingredient-dialog" aria-labelledby="addIngredient-dialog-title" open={this.props.open}>
              <DialogTitle className="dialog-title" id="addIngredient-dialog-title">Add Step 
                <IconButton className="close-icon" aria-label="close" onClick={this.handleClose}>
                  <CloseIcon />
                </IconButton>
              </DialogTitle>
                  <Card>
                  <form noValidate id="add-form" autoComplete="off">
                        <CardContent>
                              <TextField 
                                  id="description" 
                                  error={!this.state.isDescriptionValid} 
                                  onChange={this.setDescription} 
                                  value={this.state.description} 
                                  multiline rowsMax={2} 
                                  className="addingredient-input" 
                                  label="Description" 
                                  variant="filled"/>
                              <Select
                                  id="type" 
                                  error={!this.state.isTypeValid} 
                                  onChange={this.setType} 
                                  value={this.state.type}  
                                  className="addingredient-input" 
                                  label="Type"  
                                  variant="filled">
                                      <MenuItem value={"prep"}>Prep</MenuItem>
                                      <MenuItem value={"cook"}>Cook</MenuItem>
                                      <MenuItem value={"wait"}>Wait</MenuItem>
                              </Select>
                              <TextField 
                                  id="time" 
                                  error={!this.state.isTimeValid} 
                                  onChange={this.setTime} 
                                  value={this.state.time} 
                                  className="addingredient-input" 
                                  label="Time" 
                                  variant="filled"/>
                              <Select
                                  id="resources" 
                                  onChange={this.setResources} 
                                  value={this.state.resources}  
                                  className="addingredient-input" 
                                  multiple
                                  label="Resources"  
                                  variant="filled">
                                      <MenuItem value={"oven"}>Oven</MenuItem>
                                      <MenuItem value={"fridge"}>Fridge</MenuItem>
                                      <MenuItem value={"microwave"}>Microwave</MenuItem>
                                      <MenuItem value={"mixer"}>Mixer</MenuItem>
                              </Select>
                        </CardContent>
                        <Button onClick={this.handleSubmit} className="addingredient-button" variant="contained" color="primary">Add Step</Button>
                    </form>
                  </Card>
            </Dialog>
          );
    }
}


export default connector(AddRecipeStep);
