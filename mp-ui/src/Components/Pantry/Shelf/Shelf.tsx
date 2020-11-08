import { Grid, IconButton, Paper } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import "./Shelf.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import IngredientComponent from "../Ingredient/Ingredient";
import { Add } from "@material-ui/icons";
import { toggleAddIngredientDialogue } from "../../../store/pantry/actions/pantry";

interface IShelfProps extends RouteComponentProps<any> {
    shelfItems: Array<Ingredient>;
    isAddShelf: boolean;
}

interface IShelfState {
}
// this function will not run in test
/* istanbul ignore next */
const mapStateToProps = (state: State , ownProps: any) => {
    return {
        ...state,
        ownProps: ownProps
    };
};
// this function will not run in test
/* istanbul ignore next */
const mapDispatchToProps = (dispatch: any) => {
    return {
        toggleAddIngredientDialogue: () => dispatch(toggleAddIngredientDialogue()),
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type ShelfCombinedProps = PropsFromRedux & IShelfProps;

export class Shelf extends React.Component<ShelfCombinedProps,IShelfState> {
    render() {
        let ingredients: Array<any> = [];
        this.props.shelfItems.forEach((item, index) => {
            ingredients.push(<IngredientComponent ingredient={item} key={item.name + index}></IngredientComponent>);
        });
        if(this.props.shelfItems.length < 6) {
            ingredients.push(
            <Grid key="add" item xs={2} className="ingredient-container">
                <IconButton color="primary" className="add-ingredient-icon" component="span" onClick={this.props.toggleAddIngredientDialogue}>
                    <Add fontSize="large"/>
                </IconButton>
            </Grid>);
        }
        return (
            <div>
                <Paper color={'secondary'} className="shelf-container" elevation={0}>
                    <Grid container className="shelf-grid">
                        {ingredients}
                    </Grid>
                </Paper>
            </div>
        );
    }
}


export default connector(Shelf);