import { Typography } from '@material-ui/core';
import React from "react";
import Grid from '@material-ui/core/Grid';

import Chip from '@material-ui/core/Chip';
import AccordionDetails from '@material-ui/core/AccordionDetails';

export default function Home(props) {
    const hash = (string) => {
        let hash = 0, i, chr;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    let inventoryEquipment = []
    for (let item of props.hiveData.inventoryEquipment) {
        inventoryEquipment.push(<Chip color="secondary" label={item} key={hash(item)} />)
    }
    let hiveEquipment = []
    for (let item of props.hiveData.hiveEquipment) {
        hiveEquipment.push(<Chip color="secondary" label={item} key={hash(item)} />)
    }

    return (
        <AccordionDetails>
            <Grid container spacing={2}>
                {props.hiveData.image !== 'none' ? <Grid item>
                    <img style={{
                        height: '10vw',
                        width: '10vw',
                        borderRadius: 25,
                        border: '1px solid black',
                        objectFit: 'cover',
                        objectPosition: 'center',
                        borderWidth: 1
                    }} src={props.hiveData.image} alt='Hive' >
                    </img>
                </Grid>
                    : null}
                <Grid item container sm spacing={3}>
                    <Grid item>
                        <Typography>Honey: <span style={{ color: "#e6af00" }}>{props.hiveData.honeyStores}%</span></Typography>
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
                    <Grid item container spacing={8}>
                        <Grid item>
                            <Typography>Hive Equipment</Typography>
                            {hiveEquipment}
                        </Grid>
                        <Grid item>
                            <Typography>Inventory</Typography>
                            {inventoryEquipment}
                        </Grid>
                    </Grid>
                </Grid>
                

            </Grid>
        </AccordionDetails>
    )
}