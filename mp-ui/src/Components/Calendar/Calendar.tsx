import React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
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
            filteredEntries: []
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
  handleClickDay = (day: Date) => {
    this.setState({
      filteredEntries: this.props.calendarEntryList.filter(
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
        <CalendarEntryListDisplayComponent calendarEntries={this.state.filteredEntries} />
      </div>
    );
  }
}

export default connector(withRouter(CalendarPage));
