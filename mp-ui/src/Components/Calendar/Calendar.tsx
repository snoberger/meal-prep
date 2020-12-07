import React from "react";
import Calendar from "react-calendar";
import { connect, ConnectedProps } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { getUserId } from "../../store/auth/reducers/auth";
import { handleFetchAllCalendarEntries } from "../../store/calendar/actions/calendar";
import {
  CalendarEntry,
  getCalendarEntryList,
} from "../../store/calendar/reducers/calendar";
import { State } from "../../store/rootReducer";
import "./Calendar.css";
import CalendarEntryListDisplayComponent from "./CalendarEntryListComponent/CalendarEntryListDisplayComponent";

interface ICalendarProps extends RouteComponentProps<any> {}

interface ICalendarState {
  filteredEntries: CalendarEntry[];
  entryList: CalendarEntry[];
  selectedDay?: Date;
}

export interface CalendarEvent {
  date: Date;
  notify: string;
  description: string;
}
const mapStateToProps = (state: State /*, ownProps*/) => {
  return {
    ...state,
    calendarEntryList: getCalendarEntryList(state),
    userId: getUserId(state),
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    fetchCalendarList: (userId: string) =>
      dispatch(handleFetchAllCalendarEntries(userId)),
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type CalendarCombinedProps = PropsFromRedux & ICalendarProps;

export class CalendarPage extends React.Component<
  CalendarCombinedProps,
  ICalendarState
> {
  constructor(props: CalendarCombinedProps) {
    super(props);

    this.state = {
      filteredEntries: [],
      entryList: this.props.calendarEntryList,
    };
  }
  async componentDidMount() {
    await this.props.fetchCalendarList(this.props.userId);
    const today = new Date();
    this.setState({
      filteredEntries: this.props.calendarEntryList.filter(
        (calendarEntry: CalendarEntry) => {
          let entryDate = new Date(calendarEntry.date);
          return entryDate.getDate() === today.getDate();
        }
      ),
    });
  }
  async componentDidUpdate() {
    if (this.props.calendarEntryList !== this.state.entryList) {
      await this.props.fetchCalendarList(this.props.userId);
      this.setState({
        entryList: this.props.calendarEntryList,
        filteredEntries: this.props.calendarEntryList.filter(
          (calendarEntry: CalendarEntry) => {
            let entryDate = new Date(calendarEntry.date);
            return (
              entryDate.getDate() ===
              (this.state.selectedDay || new Date()).getDate()
            );
          }
        ),
      });
    }
  }
  handleClickDay = (day: Date) => {
    this.setState({
      selectedDay: day,
      filteredEntries: this.state.entryList.filter(
        (calendarEntry: CalendarEntry) => {
          let entryDate = new Date(calendarEntry.date);
          return entryDate.getDate() === day.getDate();
        }
      ),
    });
  };

  render() {
    return (
      <div className="calendar-container">
        <Calendar className="react-calendar" onClickDay={this.handleClickDay} />
        <CalendarEntryListDisplayComponent
          calendarEntries={this.state.filteredEntries}
        />
      </div>
    );
  }
}

export default connector(withRouter(CalendarPage));
