import {
  Button,
  Grid,
  Typography,
  Dialog,
  DialogTitle,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import React from "react";
import { CalendarEntry } from "../../../store/calendar/reducers/calendar";
import "./SelectCalendarEntry.css";

export interface ISelectCalendarEntryProps {
  calendarEntries: CalendarEntry[];
  open: boolean;
  selectItem: (calendarEntry: CalendarEntry) => void;
  onClose: () => void;
}

export interface ISelectCalendarEntryState {
  selectedItem: number;
  showAdd: boolean;
}

export default class SelectCalendarEntryComponent extends React.Component<
  ISelectCalendarEntryProps,
  ISelectCalendarEntryState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      showAdd: false,
      selectedItem: 0,
    };
  }
  getDate = (date: Date) => {
    const curDate = new Date(date);
    return curDate.toLocaleString();
  };
  handleClose = () => {
    this.setState({
      selectedItem: 0,
    });
    this.props.onClose();
  };
  selectItem = (index: number) => () => {
    this.props.selectItem(this.props.calendarEntries[index]);
  };
  render() {
    return (
      <Dialog
        className="addingredient-dialog"
        aria-labelledby="addIngredient-dialog-title"
        open={this.props.open}
      >
        <DialogTitle className="dialog-title" id="addIngredient-dialog-title">
          Select an event to edit
          <IconButton
            className="close-icon"
            aria-label="close"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <Grid
          style={{ marginBottom: 50, width: "100%" }}
          container
          direction="column"
        >
          {this.props.calendarEntries.map((entry, index) => {
            return (
              <Grid key={index} item className="calendar-edit-entry-container">
                <div
                  style={{
                    justifySelf: "center",
                    backgroundColor:
                      this.state.selectedItem === index ? "#412d8b" : "#ffffff",
                  }}
                  onClick={() => {
                    this.setState({ selectedItem: index });
                  }}
                >
                  <Typography className="calendar-edit-entry-date">
                    {this.getDate(entry.date)}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="calendar-edit-entry-description"
                  >
                    {entry.description}
                  </Typography>
                </div>
              </Grid>
            );
          })}
          <div
            style={{
              width: "100%",
              marginTop: 10,
              alignContent: "center",
              display: "inline-flex",
            }}
          >
            <Button
              style={{ marginLeft: 10, marginRight: 10, flex: 1 }}
              variant="contained"
              title={"Close"}
              onClick={() => {
                this.handleClose();
              }}
            >
              Close
            </Button>
            <Button
              style={{ marginLeft: 10, marginRight: 10, flex: 1 }}
              variant="contained"
              color="primary"
              title={"Select"}
              onClick={() => {
                this.props.selectItem(
                  this.props.calendarEntries[this.state.selectedItem]
                );
                this.setState({
                  selectedItem: 0,
                });
              }}
            >
              Select
            </Button>
          </div>
          {/* {this.state.showAdd ? <AddCalendarEntry /> : null} */}
        </Grid>
      </Dialog>
    );
  }
}
