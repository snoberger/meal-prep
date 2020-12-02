import { Button, Grid, Typography } from "@material-ui/core";
import React from "react";
import { CalendarEntry } from "../../../store/calendar/reducers/calendar";
import "./CalendarEntryListDisplayComponent.css";
import CreateOutlinedIcon from "@material-ui/icons/CreateOutlined";

import { Add, Delete } from "@material-ui/icons";
import AddCalendarEntry from "../AddCalendarEntry/AddCalendarEntry";
import EditCalendarEntry from "../EditCalendarEntry/EditCalendarEntry";
import { State } from "../../../store/rootReducer";
import {
    handleDeleteCalendar,
  toggleAddCalendarEntryDialogue,
  toggleEditCalendarEntryDialogue,
} from "../../../store/calendar/actions/calendar";
import { connect, ConnectedProps } from "react-redux";
import SelectCalendarEntryComponent from "../SelectCalendarEntry/SelectCalendarEntry";
import { getUserId } from "../../../store/auth/reducers/auth";

export interface ICalendarEntryListDisplayProps {
  calendarEntries: CalendarEntry[];
}

export interface ICalendarEntryListDisplayState {
  showEntryPicker: boolean;
  displayDelete: number;
}
const mapStateToProps = (
  state: State,
  ownProps: ICalendarEntryListDisplayProps
) => ({
  ...state,
  userId: getUserId(state),
  calendarEntries: ownProps.calendarEntries,
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleAddCalendarEntryDialogue: () =>
      dispatch(toggleAddCalendarEntryDialogue()),
    toggleEditCalendarEntryDialogue: (calendarEntry: CalendarEntry) => {
      dispatch(toggleEditCalendarEntryDialogue(calendarEntry));
    },
    handleDeleteCalendarEntry: (calendarEntry: CalendarEntry, userId: string) =>{
        dispatch(handleDeleteCalendar(calendarEntry, userId));
      },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type CalendarEntryListDisplayCombinedProps = PropsFromRedux &
  ICalendarEntryListDisplayProps;

export class CalendarEntryListDisplayComponent extends React.Component<
  CalendarEntryListDisplayCombinedProps,
  ICalendarEntryListDisplayState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      showEntryPicker: false,
      displayDelete: -1,
    };
  }
  getDate = (date: Date) => {
    const curDate = new Date(date);
    return curDate.toLocaleString();
  };
  deleteCalendar = (index: number) => () => {
    this.props.handleDeleteCalendarEntry(this.props.calendarEntries[index], this.props.userId);
  }
  render() {
    return (
      <Grid container direction="column">
        {this.props.calendarEntries.map((entry, index) => {
          return (
            <div
            key={index}
              onMouseOver={() => {
                this.setState({ displayDelete: index });
              }}
              onMouseLeave={() => {
                this.setState({ displayDelete: -1 });

              }}
            >
              <Grid item className="calendar-entry-container">
                <div style={{flex: 10}}>
                  <Typography className="calendar-entry-date">
                    {this.getDate(entry.date)}
                  </Typography>
                  <Typography
                    variant="body1"
                    className="calendar-entry-description"
                  >
                    {entry.description}
                  </Typography>
                </div>
                {this.state.displayDelete === index ? (
                  <Button onClick={this.deleteCalendar(index)} style={{flex: 1}}>
                    <Delete />
                  </Button>
                ) : null}
              </Grid>
            </div>
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
          {this.props.calendarEntries &&
          this.props.calendarEntries.length > 0 ? (
            <Button
              onClick={() => {
                this.setState({ showEntryPicker: true });
              }}
            >
              <CreateOutlinedIcon color="primary" fontSize="large" />
            </Button>
          ) : null}
        </div>
        <AddCalendarEntry />
        <EditCalendarEntry />
        <SelectCalendarEntryComponent
          onClose={() => {
            this.setState({ showEntryPicker: false }, () => {
              //   this.props.toggleEditCalendarEntryDialogue(calendarEntry);
            });
          }}
          selectItem={(calendarEntry: CalendarEntry) => {
            this.setState({ showEntryPicker: false }, () => {
              this.props.toggleEditCalendarEntryDialogue(calendarEntry);
            });
          }}
          open={this.state.showEntryPicker}
          calendarEntries={this.props.calendarEntries}
        />
      </Grid>
    );
  }
}

export default connector(CalendarEntryListDisplayComponent);
