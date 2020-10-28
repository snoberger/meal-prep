import { Card, CardHeader, CardMedia, Grid } from "@material-ui/core";
import { RouteComponentProps } from 'react-router-dom';
import { withRouter } from 'react-router';
import "./Home.css";
import React from "react";
import cookImg from '../../assets/cook.svg';
import recipesImg from '../../assets/recipes.svg';
import pantryImg from '../../assets/pantry.svg';
import calendarImg from '../../assets/calendar.svg';
import { AppScreens } from "../../Routes";


interface IHomeProps extends RouteComponentProps<any> {

}

interface IHomeState {
}


class Home extends React.Component<IHomeProps,IHomeState> {

    
    constructor(props: any) {
        super(props);

        this.state = {
        };
    }
    handleClick(route: string) {
        this.props.history.push(route)
    }
    
    render() {
        return (
            <Grid container justify="center" alignItems="center">
                <Grid 
                    item
                    container 
                    className="main-container" 
                    justify="center" 
                    xs={8}
                    spacing={2} 
                    alignItems="center"
                    >
                        <Grid item container lg={6} xl={6} justify="center"  alignItems="center">
                            <Card className='info-card' onClick={()=>{this.handleClick(AppScreens.COOK)}}>
                                <CardHeader title="Cook"/>
                                <CardMedia className="info-media"> <img src={cookImg} className="info-image" alt="Cook"/> </CardMedia>
                            </Card>
                        </Grid>
                        <Grid item container lg={6} xl={6} justify="center"  alignItems="center">
                            <Card className='info-card' onClick={()=>{this.handleClick(AppScreens.RECIPES)}}>
                                <CardHeader title="Recipes"/>
                                <CardMedia className="info-media"> <img src={recipesImg} className="info-image" alt="Recipes"/> </CardMedia>
                            </Card>
                        </Grid>
                        <Grid item container lg={6} xl={6} justify="center"  alignItems="center">
                            <Card className='info-card' onClick={()=>{this.handleClick(AppScreens.PANTRY)}}>
                                <CardHeader title="Pantry"/>
                                <CardMedia className="info-media"> <img src={pantryImg} className="info-image" alt="Pantry"/> </CardMedia>
                            </Card>
                        </Grid>
                        <Grid item container lg={6} xl={6} justify="center"  alignItems="center">
                            <Card className='info-card' onClick={()=>{this.handleClick(AppScreens.CALENDAR)}}>
                                <CardHeader title="Calendar"/>
                                <CardMedia className="info-media"> <img src={calendarImg} className="info-image" alt="Calendar"/> </CardMedia>
                            </Card>
                        </Grid>
                </Grid>
            </Grid>
        );
    }
  }

  export default withRouter(Home);