import { Grid } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import "./Ingredient.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import jarImg from '../../../assets/jar.svg';

interface IIngredientProps extends RouteComponentProps<any> {
    ingredient: Ingredient
}

interface IIngredientState {
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        ...state,
        ownProps: ownProps
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type IngredientCombinedProps = PropsFromRedux & IIngredientProps;

export class IngredientComponent extends React.Component<IngredientCombinedProps,IIngredientState> {
    
    render() {
      return (
        <Grid item xs={2} className="ingredient-container">
            <div className="ingredient-combined">
                <span className="absolute ingredient-name">{this.props.ingredient.name.toLocaleUpperCase()}</span>
                <img className="ingredient-image absolute" src={jarImg} alt="ingredient"/>
                <span className="absolute ingredient-amount">{this.props.ingredient.amount.toLocaleUpperCase() + ' ' + this.props.ingredient.metric.toLocaleUpperCase()}</span>
            </div>
        </Grid>
        );
    }
}


export default connector(IngredientComponent);