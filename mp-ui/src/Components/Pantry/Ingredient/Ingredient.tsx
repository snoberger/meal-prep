import { Grid } from "@material-ui/core";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";
import "./Ingredient.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import jarImg from '../../../assets/jar.svg';
import { toggleEditIngredientDialogue } from "../../../store/pantry/actions/pantry";


interface IIngredientProps {
    ingredient: Ingredient
}

interface IIngredientState {
    isHovering: boolean,
    isFading: boolean
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
const mapDispatchToProps = (dispatch: any, ownProps: IIngredientProps) => {
    return {
        toggleEditIngredientDialogue: () => dispatch(toggleEditIngredientDialogue(ownProps.ingredient))
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
);


type PropsFromRedux = ConnectedProps<typeof connector>
type IngredientCombinedProps = PropsFromRedux & IIngredientProps;

export class IngredientComponent extends React.Component<IngredientCombinedProps, IIngredientState> {

    constructor(props: IngredientCombinedProps) {
        super(props);
        this.state = ({ isHovering: false, isFading: false });
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleAnimationEnd = this.handleAnimationEnd.bind(this);
    }

    handleMouseEnter() {
        this.setState({ isFading: true });
    }

    handleMouseLeave() {
        this.setState({ isHovering: false, isFading: false });
    }

    handleAnimationEnd() {
        this.setState({ isHovering: true });
    }

    render() {
        const myIngredient =
            <div className={this.state.isFading ? "fade-out ingredient-combined" : "ingredient-combined"}>
                <span className="absolute ingredient-name">{this.props.ingredient.name.toLocaleUpperCase()}</span>
                <img className="ingredient-image absolute" src={jarImg} alt="ingredient" />
                <span className="absolute ingredient-amount">{this.props.ingredient.amount.toLocaleUpperCase() + ' ' + this.props.ingredient.metric.toLocaleUpperCase()}</span>
            </div>;

        const hoveredIngredient = 
            <div className="edit-ingredient fade-in">
                <CreateOutlinedIcon fontSize="large" className="createIcon" />
                <p className="editText">Edit</p>
            </div>;

        return (
            <Grid item xs={2} className="ingredient-container"
                onMouseEnter={this.handleMouseEnter}
                onMouseLeave={this.handleMouseLeave}
                onAnimationEnd ={this.handleAnimationEnd}
                onClick={this.props.toggleEditIngredientDialogue}
            >
                {!this.state.isHovering && myIngredient
                    ||
                    hoveredIngredient
                }
            </Grid>
        );
    }
}


export default connector(IngredientComponent);