import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@material-ui/core";
import DeleteForeverRounded from '@material-ui/icons/DeleteForeverRounded'
import { Hive } from "../../../libs/util"

export default function DeleteHive(props) {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = async () => {
        let filtered = props.allHives.filter(hive => hive.id !== props.hive.id)
        let userId = localStorage.getItem('auth');
        await Hive.deleteHive(userId, props.hive.id);
        setOpen(false);
        props.setHives(filtered);
    };

    return (
        <div>
            <IconButton color="primary" size="small" component="span" onClick={handleClickOpen}>
                <DeleteForeverRounded />
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
            >
                <DialogContent>
                    <DialogContentText>
                        Are you sure you would like to delete this hive?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        Yes
                    </Button>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}