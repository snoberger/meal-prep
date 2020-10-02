import React from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, IconButton } from "@material-ui/core";
import DeleteForeverRounded from '@material-ui/icons/DeleteForeverRounded'
import { Hive } from "../../../libs/util"

export default function DeleteHive(props) {

    const [open, setOpen] = React.useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleDelete = async () => {
        let copy = props.allHives.slice();
        let filtered = copy.filter(hive => hive.hiveId !== props.hive.hiveId)
        let userId = localStorage.getItem('auth');
        await Hive.deleteHive(userId, props.hive.hiveId);
        setOpen(false);
        props.setHives(filtered);
    };

    const handleClose = () => {
        setOpen(false);
    }

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
                    <Button onClick={handleDelete} color="primary">
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