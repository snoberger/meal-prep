import React, {useState, useRef, useEffect} from "react";
import NavBar from "../NavBar/NavBar";
import {Grid, Accordion, IconButton, AccordionActions, AccordionSummary} from '@material-ui/core';
import Create from '@material-ui/icons/Create';
import { Typography } from "@material-ui/core";
import Hive from "./Hive";
import AddHive from "./AddHive/AddHive";
import DeleteHive from "./DeleteHive/DeleteHive";
import {getUsersHives} from "../../libs/Hive";
import { Add } from "@material-ui/icons";
import EditHive from "./EditHive/EditHive"

export default function Home() {
    
    const [hives, setHives] = useState([]);
    const [open, setOpen] = useState(false);
    const [currentHive, setCurrentHive] = useState();
    let hasLoaded = useRef(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const editClick = (hive)=>() => {
        setCurrentHive(hive)
        console.log("hello", hive, currentHive)
    }
    const makeHive = (hive) => {
        return (
            <React.Fragment key={hive.hiveId}>
                <Accordion style={{ backgroundColor: "#dcdcdc" }}>
                    <AccordionSummary>
                        <Typography variant="h5">{hive.name}</Typography>
                    </AccordionSummary>                    
                    <AccordionActions>
                        <IconButton color="primary" size="small" component="span" onClick={editClick(hive)}>
                            <Create/>
                            
                        </IconButton>
                        <DeleteHive hive={hive} setHives={setHives} allHives={hives}/>
                    </AccordionActions>
                    <Hive hiveData={hive}></Hive>
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
            <EditHive hive={currentHive} handleOpen={handleOpen} handleClose={()=>{
                setCurrentHive(undefined)
            }} /> 
        </div>
    )
}