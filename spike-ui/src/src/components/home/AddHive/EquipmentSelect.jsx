import React from "react";
import { Select, MenuItem } from "@material-ui/core";
const EquipmentSelect = React.forwardRef((props, ref) => {
    return (
        <Select
            label="InventoryEquipment"
            variant="outlined"
            id="equip-select"
            multiple
            value={props.equipment}
            onChange={props.handleChange(props.type)}
            >
            {props.equipmentChoices.map((equ) => (
                <MenuItem key={equ} value={equ}>
                    {equ}
                </MenuItem>
            ))}
        </Select>
    )
})

export default EquipmentSelect