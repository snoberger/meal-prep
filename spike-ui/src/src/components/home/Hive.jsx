import { Typography } from '@material-ui/core';
import React from "react";
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

import Chip from '@material-ui/core/Chip';
import AccordionDetails from '@material-ui/core/AccordionDetails';

export default function Home(props) {
    let inventoryEquipment = []
    for(let item of props.hiveData.inventoryEquipment){
        inventoryEquipment.push(<Chip label={item} />)
    }
    let hiveEquipment = []
    for(let item of props.hiveData.hiveEquipment){
        hiveEquipment.push(<Chip label={item} />)
    }
    return (
        <AccordionDetails>
            <Grid container spacing={1}>
                <Grid item>
                    <Typography>Honey: <span style={{color: "yellow"}}>{props.hiveData.honey}</span></Typography>
                </Grid>
                <Grid item>
                    <Typography>Queen Production:{props.hiveData.queenProduction}</Typography>
                </Grid>
                <Grid item>
                    <Typography>Health:{props.hiveData.health}</Typography>
                </Grid>
                <Grid item>
                    <Typography>losses:{props.hiveData.losses}</Typography>
                </Grid>
                <Grid item>
                    <Typography>gains:{props.hiveData.gains}</Typography>
                </Grid>
                <Grid container spacing={3}>
                    <Grid item>
                        <Card>
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