import React, {useState} from "react";
import NavBar from "../NavBar/NavBar";
import {Grid, Accordion, IconButton, AccordionActions, AccordionSummary} from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import { Typography } from "@material-ui/core";
import Hive from "./Hive"
import AddHive from "./AddHive/AddHive"

import { Add } from "@material-ui/icons";
export default function Home() {
    
    const [hives, setHives] = useState([
        {
            name: "Mine",
            honeyStores: "100%",
            queenProduction: "10",
            health: "100hp",
            losses: "0",
            gains: "swole",
            inventoryEquipment: ["netting"],
            hiveEquipment: ["box"]
        },
        {
            name: "Someones",
            honey: "72%",
            queenProduction: "3",
            health: "100hp",
            losses: "0",
            gains: "moderate",
            inventoryEquipment: ["netting"],
            hiveEquipment: [""]
        },
        {
            name: "No ones",
            honey: "0%",
            queenProduction: "1",
            health: "10hp",
            losses: "1,000,000",
            gains: "none",
            inventoryEquipment: [""],
            hiveEquipment: ["box"]
        }
    ]);
    let hiveViews = []
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = (hive) => {
        console.log(hive)
        if(hive.name){
            let temp = hives.slice();
            temp.push(hive)
            console.log(temp)
            setHives(temp)
        }
        
        setOpen(false);
    };
    for (let hive of hives) {
        hiveViews.push(
            <Accordion style={{ backgroundColor: "#dcdcdc" }} key={hive.name}>
                <AccordionSummary>
                    <Typography variant="h5"> {hive.name}</Typography>

                </AccordionSummary>
                <AccordionActions>
                    <IconButton color="primary" size="small" component="span">
                        <Create />
                    </IconButton>
                </AccordionActions>
                <Hive hiveData={hive}></Hive>
            </Accordion>)
    }
    return (
        <div>
            <NavBar />
            <Grid style={{ marginTop: "5em"}} container justify="center" >
                <Grid>
                    {hiveViews}
                </Grid >
                <Grid style={{width: '100%'}}>
                    <IconButton color="primary" onClick={handleOpen} component="span">
                        <Add />
                    </IconButton>
                </Grid >
            </Grid>
            <AddHive className="add-modal" open={open} handleOpen={handleOpen} handleClose={handleClose}/>
        </div>
    )
}