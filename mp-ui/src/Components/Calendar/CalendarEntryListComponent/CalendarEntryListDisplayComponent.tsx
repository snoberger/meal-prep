import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import { CalendarEntry } from "../../../store/calendar/reducers/calendar";
import "./CalendarEntryListDisplayComponent.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";

import { Add } from "@material-ui/icons";
import AddCalendarEntry from "../AddCalendarEntry/AddCalendarEntry";
import { State } from "../../../store/rootReducer";
import { toggleAddCalendarEntryDialogue } from "../../../store/calendar/actions/calendar";
import { connect, ConnectedProps } from "react-redux";

export interface ICalendarEntryListDisplayProps 
{
  calendarEntries: CalendarEntry[];
}

export interface ICalendarEntryListDisplayState {}
const mapStateToProps = (state: State, ownProps: ICalendarEntryListDisplayProps) => ({
  ...state,
  calendarEntries: ownProps.calendarEntries
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleAddCalendarEntryDialogue: () =>
      dispatch(toggleAddCalendarEntryDialogue())
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type CalendarEntryListDisplayCombinedProps = PropsFromRedux & ICalendarEntryListDisplayProps;


export class CalendarEntryListDisplayComponent extends React.Component<CalendarEntryListDisplayCombinedProps> {
  constructor(props: any) {
    super(props);

    this.state = {
      showAdd: false,
    };
  }
  getDate = (date: Date) => {
    const curDate = new Date(date);
    return curDate.toLocaleString();
  };
  render() {
    return (
      <Grid container direction="column">
        {this.props.calendarEntries.map((entry, index) => {
          return (
            <Grid key={index} item className="calendar-entry-container">
              <Typography className="calendar-entry-date">
                {this.getDate(entry.date)}
              </Typography>
              <Typography
                variant="body1"
                className="calendar-entry-description"
              >
                {entry.description}
              </Typography>
            </Grid>
          );
        })}
        <div style={{ flexDirection: "row" }}>
          <Button
            onClick={() => {
                this.props.toggleAddCalendarEntryDialogue();
            }}
          >
            <Add color="primary" fontSize="large" />
          </Button>
          <Button>
            <CreateOutlinedIcon color="primary" fontSize="large" />
          </Button>
        </div>
        {/* {this.state.showAdd ? <AddCalendarEntry /> : null} */}
        <AddCalendarEntry />
      </Grid>
    );
  }
}

export default connector(CalendarEntryListDisplayComponent);