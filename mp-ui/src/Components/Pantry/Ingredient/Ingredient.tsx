import { Checkbox, FormControl, FormControlLabel, FormGroup, Grid } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import "./Ingredient.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { getDeleteIngredientViewOpen, Ingredient } from "../../../store/pantry/reducers/pantry";
import jarImg from '../../../assets/jar.svg';

interface IIngredientProps extends RouteComponentProps<any> {
    ingredient: Ingredient
}

interface IIngredientState {
    ingredChecked: boolean
}

// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        ...state,
        ownProps: ownProps,
        deleteMode: getDeleteIngredientViewOpen(state),
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (/*dispatch: any*/) => {
    return {
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);

type PropsFromRedux = ConnectedProps<typeof connector>
type IngredientCombinedProps = PropsFromRedux & IIngredientProps;

const initialState = {
    ingredChecked: false,
};

export class IngredientComponent extends React.Component<IngredientCombinedProps, IIngredientState> {

    constructor(props: any) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
        this.state = initialState;
    }


    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ ...this.state, [event.target.name]: event.target.checked });
    };

    render() {
        let items
        if (!this.props.deleteMode) {
            items = <div className="ingredient-combined">
                <span className="absolute ingredient-name">{this.props.ingredient.name.toLocaleUpperCase()}</span>
                <img className="ingredient-image absolute" src={jarImg} alt="ingredient" />
                <span className="absolute ingredient-amount">{this.props.ingredient.amount.toLocaleUpperCase() + ' ' + this.props.ingredient.metric.toLocaleUpperCase()}</span>
            </div>
        }
        else {
            items =
                <FormControl>
                    <FormGroup>
                        <FormControlLabel
                            value="ingred-check-group"
                            // control={<Checkbox checked={this.state.ingredChecked} onChange={this.handleChange} name="ingredient-checkbox" />}
                            control={<Checkbox />}
                            label={
                                <React.Fragment>
                                    {/* <div className="ingredient-combined"> */}
                                    {/* <Checkbox checked={this.state.ingredChecked} onChange={this.handleChange} name="ingredient-checkbox" /> */}
                                    <span className="absolute ingredient-name">{this.props.ingredient.name.toLocaleUpperCase()}</span>
                                    <img className="ingredient-image absolute" src={jarImg} alt="ingredient" />
                                    <span className="absolute ingredient-amount">{this.props.ingredient.amount.toLocaleUpperCase() + ' ' + this.props.ingredient.metric.toLocaleUpperCase()}</span>
                                    {/* </div> */}
                                </React.Fragment>
                            }
                            labelPlacement="end"
                        />
                    </FormGroup>
                </FormControl>
        }
        return (
            <Grid item xs={2} className="ingredient-container">
                {items}
            </Grid>
        );
    }
}


export default connector(IngredientComponent);