import { Card, CardMedia, CardActionArea, LinearProgress, Grid} from '@material-ui/core';
import React from 'react';

export default function Loading() {
    return (
        <Grid container style={{height: '100vh'}} justify="center" alignContent="center">
            <Grid item>
                <Card style={{maxHeight: '300px'}}>
                    <CardActionArea>
                        <CardMedia
                            component="img"
                            src={require("../assets/honey-pot.png")}
                            title="loading screen"
                        />
                        <LinearProgress color="secondary" />
                    </CardActionArea>
                </Card>
            </Grid>
        </Grid>
        
    )
    
}