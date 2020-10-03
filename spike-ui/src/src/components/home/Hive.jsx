import { Typography, Divider } from '@material-ui/core';
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
        inventoryEquipment.push(<Grid item><Chip color="secondary" label={item} key={hash(item)} /></Grid>)
    }
    let hiveEquipment = []
    for (let item of props.hiveData.hiveEquipment) {
        hiveEquipment.push(<Grid item><Chip color="secondary" label={item} key={hash(item)} /></Grid>)
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
                    <Grid item container style={{marginLeft:"5px"}} direction="row">
                        <Grid item direction="row" container> 
                            <div style={{width:"40%", paddingRight: "1%"}}>
                            <Typography >Hive Equipment</Typography>
                            <Divider/>
                            </div>
                            <div style={{width:"40%"}}>
                            <Typography>Inventory</Typography>
                            <Divider/>
                            </div>
                        </Grid>
                        <Grid item style={{width:"40%", margin: "2% 3% 1% 0%"}} container spacing={1}>
                             {hiveEquipment}
                        </Grid>
                        
                        <Grid item container style={{width:"40%", marginTop:"2%"}} spacing={1}>
                            {inventoryEquipment}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </AccordionDetails>
    )
}