import { Typography } from '@material-ui/core';
import React from "react";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Chip from '@material-ui/core/Chip';
import AccordionDetails from '@material-ui/core/AccordionDetails';

export default function Home(props) {
    const hash = (string) => {
        let hash = 0, i, chr;
        for (i = 0; i < string.length; i++) {
            chr   = string.charCodeAt(i);
            hash  = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    let inventoryEquipment = []
    for(let item of props.hiveData.inventoryEquipment){
        inventoryEquipment.push(<Chip label={item} key={hash(item)}/>)
    }
    let hiveEquipment = []
    for(let item of props.hiveData.hiveEquipment){
        hiveEquipment.push(<Chip label={item} key={hash(item)}/>)
    }

    return (
        <AccordionDetails>
            <Grid container spacing={1}>
                <Grid item>
                    <Typography>Honey: <span style={{color: "#ffd54f"}}>{props.hiveData.honeyStores}%</span></Typography>
                </Grid>
                <Grid item>
                    <Typography>Queen Production: {props.hiveData.queenProduction}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Health: {props.hiveData.health}hp</Typography>
                </Grid>
                <Grid item>
                    <Typography>Losses: {props.hiveData.losses}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Gains: {props.hiveData.gains}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Results: {props.hiveData.inspectionResults} </Typography>
                </Grid>
                <Grid container spacing={8}>
                    <Grid item>
                        <Card >
                            <CardContent>
                                <Typography>Hive Equipment</Typography>
                                {hiveEquipment}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item>
                        <Card>
                            <CardContent>
                                <Typography>Inventory</Typography>
                                {inventoryEquipment}
                            </CardContent>  
                        </Card>
                    </Grid>
                </Grid>

            </Grid>
        </AccordionDetails>
    )
}