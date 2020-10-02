import React, {useState, useRef, useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import {Grid, Accordion, IconButton, AccordionActions, AccordionSummary, Divider} from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import { Typography } from "@material-ui/core";
import Hive from "./Hive";
import AddHive from "./AddHive/AddHive";
import DeleteHive from "./DeleteHive/DeleteHive";
import {getUsersHives} from "../../libs/Hive";
import { Add } from "@material-ui/icons";

export default function Home() {
    
    const [hives, setHives] = useState([]);
    const [open, setOpen] = useState(false);
    let hasLoaded = useRef(false);

    const handleOpen = () => {
        setOpen(true);
    };


    const makeHive = (hive) => {
        return (
            <React.Fragment key={hive.hiveId}>
                <Accordion style={{ backgroundColor: "#eaeaea", margin: '30px' }}>
                    <AccordionSummary>
                        <Typography variant="h5">{hive.name}</Typography>
                        
                    </AccordionSummary>                    
                    <Hive hiveData={hive}></Hive>
                    <Divider />
                    <AccordionActions>
                        <IconButton color="primary" size="small" component="span">
                            <Create/>
                        </IconButton>
                        <DeleteHive hive={hive} setHives={setHives} allHives={hives}/>
                    </AccordionActions>
                </Accordion>
            </React.Fragment>
        )
    }

    const handleClose = (hive) => {
        if(hive.name){
            let temp = hives.slice();
            temp.push(hive);
            setHives(temp)
        }
        setOpen(false);
    };

    const setupViewHives = (hives) => {
        return hives.map(hive => makeHive(hive));
    }

    useEffect(() => {
        const loadHives = async () => {
            let userId = localStorage.getItem('auth');
            let userHives = (await getUsersHives(userId)).data.Items;
            return userHives;
        }
        loadHives().then(d => {
            setHives(d);
            hasLoaded.current = true;
        });
    }, [hasLoaded]);

    return (
        <div>
            <NavBar />
            <Grid style={{ marginTop: "5em"}} container justify="center" >
                <Grid>
                    {hives.length ? setupViewHives(hives) : <span>No hives found.</span>}
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