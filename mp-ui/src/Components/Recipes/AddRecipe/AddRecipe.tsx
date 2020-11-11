import { AppBar, Box, Button, Card, Checkbox, Dialog, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Select, Slider, TextField, Typography } from '@material-ui/core';
import React, { FormEvent } from 'react';
import { Recipe } from '../../../store/recipes/reducers/recipes';

export const defaultRecipe: Recipe = {
    id: '',
    name: '',
    description: '',
    ingredients: [],
    steps: []
}

export interface AddRecipeProps {
    isOpen: boolean,
    onClose: () => void
}
export default class AddRecipe extends React.Component<AddRecipeProps, {
    recipe?: Partial<Recipe>
}>{

    constructor(props: AddRecipeProps) {
        super(props);

        this.state = {
            recipe: defaultRecipe
        }
    }
    handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

    }
    handleChangeName = (event: FormEvent<HTMLDivElement>) => {
        this.setState((state) => {
            const newRecipe = state.recipe;

            newRecipe?.name = event.target.value
        })
    }
    render() {
        return(
            <Dialog className="add-modal" open={this.props.isOpen} onClose={this.props.onClose}>
            <Card className="overflow-card">
                <AppBar position="static" className="add-bar" color="secondary">
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Add a new Recipe
                    </Typography>
                </AppBar>
                <Grid container className="add">
                    <form noValidate id="add-form" onSubmit={(event) => this.handleSubmit(event)} autoComplete="off">
                        <TextField className="modal-textbox-full name-field"
                            id="name"
                            value={this.state.recipe?.name}
                            onInput={this.handleChangeName}
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
                            }} src={values.image} alt={`Hive
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
                                Save changes
                            </Button>
                        </Box>
                    </form>
                </Grid>
            </Card>
        </Dialog>
        )
    }
}