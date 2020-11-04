import { Grid } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Pantry.css";
import React from "react";
import { connect, ConnectedProps } from 'react-redux';
import { getIngredients} from '../../store/pantry/reducers/pantry';
import { State } from "../../store/rootReducer";

interface IPantryProps extends RouteComponentProps<any> {
}

interface IPantryState {
    email?: string;
    password?: string;
    authToken?: string;
}
const mapStateToProps = (state: State /*, ownProps*/) => {
    return {
        ...state,
        ingredients: getIngredients(state)
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
type PantryCombinedProps = PropsFromRedux & IPantryProps;

class Pantry extends React.Component<PantryCombinedProps,IPantryState> {
    // constructor(props: any) {
    //     super(props);
    // }
    
    render() {
      return (
          <Grid>
              <div>{this.props.ingredients[0].name}</div>
          </Grid>
        );
    }
}


export default connector(withRouter(Pantry));
export let PantryNoRouter = Pantry;