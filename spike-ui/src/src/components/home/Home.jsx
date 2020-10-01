import React, {useState} from "react";
import NavBar from "../NavBar/NavBar";
import Grid from '@material-ui/core/Grid';
import Accordion from '@material-ui/core/Accordion';
import IconButton from '@material-ui/core/IconButton';
import AccordionActions from '@material-ui/core/AccordionActions';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import Create from '@material-ui/icons/Create';
import { Modal, Typography } from "@material-ui/core";
import Hive from "./Hive"
import AddHive from "./AddHive/AddHive"
import './Home.css';

import { Add } from "@material-ui/icons";
export default function Home() {
    const hives = [
        {
            name: "Mine",
            honey: "100%",
            qProduction: "10",
            health: "100hp",
            losses: "0",
            gains: "swole",
            inventoryEq: ["netting"],
            hiveEq: ["box"]
        },
        {
            name: "Someones",
            honey: "72%",
            qProduction: "3",
            health: "100hp",
            losses: "0",
            gains: "moderate",
            inventoryEq: ["netting"],
            hiveEq: [""]
        },
        {
            name: "No ones",
            honey: "0%",
            qProduction: "1",
            health: "10hp",
            losses: "1,000,000",
            gains: "none",
            inventoryEq: [""],
            hiveEq: ["box"]
        }
    ]
    let hiveViews = []
    const [open, setOpen] = useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
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
            <Grid style={{ marginTop: "5em" }} container justify="center" >
                <Grid item >
                    {hiveViews}
                </Grid>
                <Grid>
                    <IconButton color="primary" onClick={handleOpen} component="span">
                        <Add />
                    </IconButton>
                </Grid>
            </Grid>
            <Modal
                style= {{
                    marginTop: '5%',
                    marginBottom: '5%',
                }}
                children={AddHive}
                className="add-modal"
                open={open}
                onClose={handleClose}
            >
                <AddHive handleClose={handleClose} />
            </Modal>
        </div>
    )
}