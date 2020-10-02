import React, { useState } from "react";
import Grid from '@material-ui/core/Grid';
import AppBar from '@material-ui/core/AppBar';
import { Typography, Button, Box, TextField, Card, Dialog, Slider, FormControl, InputLabel, Select, MenuItem, Checkbox, FormControlLabel } from "@material-ui/core";
import { Hive } from '../../../libs/util.ts';
import './AddHive.css';
import EquipmentSelect from "./EquipmentSelect";
import { InventoryEquipmentTypes } from "../../../constants/Hive.js"
import { HiveEquipmentTypes } from "../../../constants/Hive.js"



const AddHive = React.forwardRef((props, ref) => {


    const [values, setValues] = useState({
        name: '',
        inspectionResults: '',
        health: '',
        honeyStores: 30,
        queenProduction: '',
        hiveEquipment: [],
        inventoryEquipment: [],
        losses: '',
        gains: '',
        viewable: false,
        image: undefined
    });

    const handleFile = (event) => {
        const { target } = event;
        const { files } = target;

        if (files && files[0]) {
            var reader = new FileReader();

            reader.onload = event => {

                setValues({ ...values, image: event.target?.result });
            };

            reader.readAsDataURL(files[0]);
        }
    }
    const handleChange = (prop) => (event, value) => {
        let newValue;
        if (event.target.value) {
            newValue = event.target.value
        } else {
            newValue = value
        }
        setValues({ ...values, [prop]: newValue });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const hive = {
            name: values.name,
            inspectionResults: values.inspectionResults,
            health: values.health,
            honeyStores: values.honeyStores,
            queenProduction: values.queenProduction,
            hiveEquipment: values.hiveEquipment,
            inventoryEquipment: values.inventoryEquipment,
            losses: values.losses,
            gains: values.gains,
            viewable: values.viewable,
            hiveId: null,
            image: values.image
        }
        console.log("JASON", values.image, '\nHELLO', hive.image)
        try {
            let response = await Hive.create(localStorage.getItem('auth'), hive)
            hive.hiveId = response.data.hiveId;
            props.handleClose(hive);
        }
        catch (error) {
            alert("Image too large, upload an image less than 400KB");
        }
    }
    return (
        <Dialog className="add-modal" open={props.open} onClose={props.handleClose}>
            <Card className="overflow-card">
                <AppBar position="static" className="add-bar" color="secondary">
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Add a new Hive
                    </Typography>
                </AppBar>
                <Grid container className="add">
                    <form noValidate id="add-form" onSubmit={handleSubmit} autoComplete="off">
                        <TextField className="modal-textbox-full name-field"
                            id="name"
                            value={values.name}
                            onInput={handleChange("name")}
                            label="Name"
                            variant="outlined" />
                        <FormControl variant="outlined" className="modal-select health" >
                            <InputLabel >Health Level</InputLabel>
                            <Select
                                label="HealthLevel"
                                variant="outlined"
                                id="health-select"
                                value={values.health}
                                onChange={handleChange('health')}
                            >
                                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((hp) => (
                                    <MenuItem key={hp} value={hp}>
                                        {hp}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className="slider" variant="outlined">
                            <InputLabel >Honey</InputLabel>
                            <Slider valueLabelDisplay="auto" value={values.honeyStores} onChange={handleChange('honeyStores')} />
                        </FormControl>

                        <TextField className="modal-textbox-full"
                            id="username"
                            value={values.queenProduction}
                            onInput={handleChange("queenProduction")}
                            label="Queen Production"
                            variant="outlined" />
                        <TextField className="modal-textbox-half"
                            id="losses"
                            value={values.losses}
                            onInput={handleChange("losses")}
                            label="Losses"
                            variant="outlined" />
                        <TextField className="modal-textbox-half"
                            id="gains"
                            value={values.gains}
                            onInput={handleChange("gains")}
                            label="Gains"
                            variant="outlined" />
                        <FormControl variant="outlined" className="modal-select" >
                            <InputLabel >Inventory Equipment</InputLabel>
                            <EquipmentSelect equipment={values.inventoryEquipment} equipmentChoices={InventoryEquipmentTypes} type="inventoryEquipment" handleChange={handleChange} />
                        </FormControl>
                        <FormControl variant="outlined" className="modal-select" >
                            <InputLabel >Hive Equipment</InputLabel>
                            <EquipmentSelect equipment={values.hiveEquipment} equipmentChoices={HiveEquipmentTypes} type="hiveEquipment" handleChange={handleChange} />
                        </FormControl>
                        <FormControl variant="outlined" className="modal-textbox-half" >
                            <InputLabel >Inspection Result</InputLabel>
                            <Select
                                label="Inspection Result"
                                variant="outlined"
                                value={values.inspectionResults}
                                onChange={handleChange('inspectionResults')}
                            >
                                <MenuItem value="Pass">
                                    Pass
                                    </MenuItem>
                                <MenuItem value="Fail" className="danger">
                                    Fail
                                    </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl required>
                            <FormControlLabel
                                control={<Checkbox onChange={handleChange('viewable')} />} label="Viewable to Public"
                                labelPlacement="start"
                                className="viewable-checkbox"
                            />
                        </FormControl>
                        <FormControl style={{  alignItems: 'center', marginTop: 10}}>
                            <img style={{
                                height: '10vw',
                                width: '10vw',
                                borderRadius: 25,
                                border: '1px solid black',
                                objectFit: 'cover',
                                objectPosition: 'center',
                                borderWidth: 1
                            }} src={values.image} alt={`Hive Picture
                            (optional)`} >
                            </img>
                            <input
                                id="car"
                                type="file"
                                accept="image/*"
                                capture="camera"
                                onChange={handleFile}
                            />
                        </FormControl>
                        <Box className="submit-add">
                            <Button className="submit-button" type="submit" form="add-form" variant="contained" color="primary">
                                Submit
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Card>
        </Dialog>
    )
})

export default AddHive