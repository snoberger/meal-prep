import React from "react";
import { connect, ConnectedProps } from "react-redux";
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  IconButton,
  TextField,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import "./EditCalendarEntry.css";
import { State } from "../../../store/rootReducer";
import {
  CalendarEntry,
  getCalendarEntry,
  getEditCalendarEntryDialogueOpen,
} from "../../../store/calendar/reducers/calendar";
import {
  handleEditCalendar,
  toggleEditCalendarEntryDialogue,
} from "../../../store/calendar/actions/calendar";
import { getUserId } from "../../../store/auth/reducers/auth";
import moment from 'moment';
const format = 'YYYY-MM-DDThh:mm';
export interface IEditCalendarEntryProps {}

export interface IEditCalendarEntryState {
  date: string;
  notify: string;
  description: string;
  isDateValid?: boolean;
  isDescriptionValid?: boolean;
  isNotifyValid?: boolean;
  isOpen: boolean;
}
const mapStateToProps = (state: State /*, ownProps*/) => ({
  ...state,
  open: getEditCalendarEntryDialogueOpen(state),
  calendarEntry: getCalendarEntry(state),
  userId: getUserId(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleEditCalendarEntryDialogue: (calendarEntry?: CalendarEntry) =>
      dispatch(toggleEditCalendarEntryDialogue(calendarEntry)),
    handleEditCalendarEntry: (calendarEntry: CalendarEntry, userId: string) => {
      dispatch(handleEditCalendar(calendarEntry, userId));
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type EditCalendarEntryCombinedProps = PropsFromRedux & IEditCalendarEntryProps;

const initialState = {
  date: "",
  notify: "",
  description: "",
  isDateValid: true,
  isDescriptionValid: true,
  isNotifyValid: true
};

export class EditCalendarEntry extends React.Component<
  EditCalendarEntryCombinedProps,
  IEditCalendarEntryState
> {
  constructor(props: any) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setNotify = this.setNotify.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      ...initialState,
      isOpen: this.props.open
    };
  }

  setDate(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ date: e.target.value });
    this.setState({ isDateValid: true });
  }

  setDescription(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ description: e.target.value });
    this.setState({ isDescriptionValid: true });
  }
  setNotify(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ notify: e.target.value });
    this.setState({ isNotifyValid: true });
  }

  async handleSubmit() {
    if (this.state.date === "") {
      await this.setState({ isDateValid: false });
    }
    if (this.state.description === "") {
      await this.setState({ isDescriptionValid: false });
    }
    if (this.state.notify === "") {
      await this.setState({ isNotifyValid: false });
    }
    if (
      this.state.isDateValid &&
      this.state.isDescriptionValid &&
      this.state.isNotifyValid
    ) {
      //Update entry
      var newCalendarEntry: CalendarEntry = {
        date: new Date(this.state.date),
        description: this.state.description,
        notify: this.state.notify,
        id: this.props.calendarEntry.id
      };
      //Use
      this.props.handleEditCalendarEntry(newCalendarEntry, this.props.userId);
      this.props.toggleEditCalendarEntryDialogue(newCalendarEntry);

      this.setState(initialState);
    }
  }

  convertDateTime = (date?: Date): string => {
    if (!date) return "";
    try {
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDay()}T${date.getHours()}:${date.getMinutes()}`;
    } catch (error) {
      return "";
    }
  };
  handleClose() {
    this.props.toggleEditCalendarEntryDialogue();
  }
  componentDidUpdate() {
    if(this.props.open !== this.state.isOpen) {
      this.setState({isOpen: this.props.open});
      if (this.props.calendarEntry && this.props.calendarEntry.date) {
        const curDate = new Date(this.props.calendarEntry.date);
        const curDateString = moment(curDate).format(format);
        this.setState({
          description: this.props.calendarEntry.description,
          notify: this.props.calendarEntry.notify,
          date: curDateString,
        });
      }
    }
   
  }
  render() {
    return (
      <Dialog
        className="addingredient-dialog"
        aria-labelledby="addIngredient-dialog-title"
        open={this.props.open}
      >
        <DialogTitle className="dialog-title" id="addIngredient-dialog-title">
          Edit Calendar Event
          <IconButton
            className="close-icon"
            aria-label="close"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <Card>
          <form noValidate id="add-form" autoComplete="off">
            <CardContent>
              <TextField
                id="date"
                type="datetime-local"
                error={!this.state.isDateValid}
                onChange={this.setDate}
                value={this.state.date}
                rowsMax={2}
                className="addingredient-input"
                variant="filled"
              />
              <TextField
                id="description"
                error={!this.state.isDescriptionValid}
                onChange={this.setDescription}
                value={this.state.description}
                multiline
                rowsMax={5}
                className="addingredient-input"
                label="Description"
                variant="filled"
              />
              <TextField
                id="notify"
                error={!this.state.isNotifyValid}
                onChange={this.setNotify}
                value={this.state.notify}
                className="addingredient-input"
                label="Notify"
                variant="filled"
              />
            </CardContent>
            <Button
              onClick={this.handleSubmit}
              className="addingredient-button"
              variant="contained"
              color="primary"
            >
              Save
            </Button>
          </form>
        </Card>
      </Dialog>
    );
  }
}

export default connector(EditCalendarEntry);
