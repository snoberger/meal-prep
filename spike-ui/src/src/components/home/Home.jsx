import React, {useState} from "react";
import NavBar from "../NavBar/NavBar";
import {Grid, Accordion, IconButton, AccordionActions, AccordionSummary} from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import { Typography } from "@material-ui/core";
import Hive from "./Hive";
import AddHive from "./AddHive/AddHive";
import DeleteHive from "./DeleteHive/DeleteHive";

import { Add } from "@material-ui/icons";
import { updateHive } from "../../libs/Hive";
export default function Home() {
    
    const [hives, setHives] = useState([
        {
            name: "Mine",
            honeyStores: "100%",
            queenProduction: "10",
            health: "100hp",
            losses: "0",
            gains: "swole",
            inspectionResults: "Pass",
            inventoryEquipment: ["netting"],
            hiveEquipment: ["box"],
            id: 1
        },
        {
            name: "Someones",
            honeyStores: "72%",
            queenProduction: "3",
            health: "100hp",
            losses: "0",
            gains: "moderate",
            inspectionResults: "Pass",
            inventoryEquipment: ["netting"],
            hiveEquipment: [""],
            id: 2
        },
        {
            name: "No ones",
            honeyStores: "0%",
            queenProduction: "1",
            health: "10hp",
            losses: "1,000,000",
            gains: "none",
            inspectionResults: "Fail",
            inventoryEquipment: [""],
            hiveEquipment: ["box"],
            id: 3
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
            <Accordion style={{ backgroundColor: "#dbdbdb"}} key={hive.id} >
                <AccordionSummary>
                    <Typography variant="h5"> {hive.name}</Typography>
                </AccordionSummary>
                <AccordionActions>
                    <IconButton color="primary" size="small" component="span">
                        <updateHive> </updateHive>
                    </IconButton>
                    <DeleteHive hive={hive} setHives={setHives} allHives={hives}/>
                </AccordionActions>
                <Hive hiveData={hive}></Hive>
            </Accordion>
        )
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