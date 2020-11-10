import { AccordionDetails, Grid, Typography } from '@material-ui/core';
import React from 'react';
import "./Ingredient.css";

export default class Ingredient extends React.Component<{
    ingredientData: any
}, {}> {
    render() {
        return(
            <AccordionDetails>
                <Grid spacing={0} container justify="center" alignItems="center">
                    <Grid item spacing={0}> 
                        <Typography variant="body1" className="amount-text">
                            {`Amount: ${this.props.ingredientData.amount}`}
                        </Typography>
                        <Typography variant="body1" className="metric-text">
                            {`Metric: ${this.props.ingredientData.amount}`}
                        </Typography> 
                    </Grid>
                </Grid>
          </AccordionDetails>
        );
    }
}
