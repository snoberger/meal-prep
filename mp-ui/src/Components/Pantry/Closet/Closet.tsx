import { Paper } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import "./Closet.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { State } from "../../../store/rootReducer";
import { Ingredient } from "../../../store/pantry/reducers/pantry";
import Shelf from "../Shelf/Shelf";

interface IClosetProps extends RouteComponentProps<any> {
    ingredients: Array<Ingredient>
}

interface IClosetState {
}
const mapStateToProps = (state: State, ownProps: any) => {
    return {
        ...state,
        ownProps: ownProps
    };
};
const mapDispatchToProps = (dispatch: any) => {
    return {
    };
};
const connector = connect(
    mapStateToProps,
    mapDispatchToProps
  );

type PropsFromRedux = ConnectedProps<typeof connector>
type ClosetCombinedProps = PropsFromRedux & IClosetProps;

export class Closet extends React.Component<ClosetCombinedProps,IClosetState> {
    render() {
        let closet: Array<Array<Ingredient>> = []
        let shelf: Array<Ingredient> = []
        this.props.ingredients.forEach((item, index) => {
            shelf.push(item)
            if ((index + 1) % 6 === 0){
                //each shelf has at most 6 ingredients on it so push if its on a mult of 6
                closet.push(shelf);
                shelf = [];
            } 
        })
        //add whatever is left to the shelves
        if(shelf.length) {
            closet.push(shelf);
        }

        //store the data separated by shelf in shelf elements
        let shelfElements: Array<any> = [];
        closet.forEach((shelf, index)=> {
            if(index === closet.length - 1 && shelf.length === 6){
                //if this is the last shelf, but it is full add an empty shelf
                shelfElements.push(<Shelf shelfItems={shelf}></Shelf>)
                shelfElements.push(<Shelf shelfItems={[]}></Shelf>)
            } else {
                shelfElements.push(<Shelf shelfItems={shelf}></Shelf>)
            }
            
        });
        return (
            <Paper className="closet-container" elevation={0}>
                {shelfElements}
            </Paper>
        );
    }
}


export default connector(Closet);