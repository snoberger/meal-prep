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
import "./AddCalendarEntry.css";
import { State } from "../../../store/rootReducer";
import {
  CalendarEntry,
  getAddCalendarEntryDialogueOpen,
} from "../../../store/calendar/reducers/calendar";
import {
  handleCreateCalendar,
  toggleAddCalendarEntryDialogue,
} from "../../../store/calendar/actions/calendar";
import { getUserId } from "../../../store/auth/reducers/auth";

export interface IAddCalendarEntryProps {}

export interface IAddCalendarEntryState {
  date: string;
  notify: string;
  description: string;
  isDateValid?: boolean;
  isDescriptionValid?: boolean;
  isNotifyValid?: boolean;
}
const mapStateToProps = (state: State /*, ownProps*/) => ({
  ...state,
  open: getAddCalendarEntryDialogueOpen(state),
  userId: getUserId(state),
});

const mapDispatchToProps = (dispatch: any) => {
  return {
    toggleAddCalendarEntryDialogue: () =>
      dispatch(toggleAddCalendarEntryDialogue()),
    handleCreateCalendarEntry: (calendarEntry: CalendarEntry, userId: string) =>{
      dispatch(handleCreateCalendar(calendarEntry, userId));
    },
  };
};

const connector = connect(mapStateToProps, mapDispatchToProps);

type PropsFromRedux = ConnectedProps<typeof connector>;
type AddCalendarEntryCombinedProps = PropsFromRedux & IAddCalendarEntryProps;

const initialState = {
  date: "",
  notify: "",
  description: "",
};

export class AddCalendarEntry extends React.Component<
  AddCalendarEntryCombinedProps,
  IAddCalendarEntryState
> {
  constructor(props: any) {
    super(props);
    this.setDate = this.setDate.bind(this);
    this.setDescription = this.setDescription.bind(this);
    this.setNotify = this.setNotify.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = initialState;
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
      };
      //Use newCalendarEntry
      this.props.handleCreateCalendarEntry(
          newCalendarEntry,
          this.props.userId
      );
      this.props.toggleAddCalendarEntryDialogue();

      this.setState(initialState);
    }
  }

  handleClose() {
    this.props.toggleAddCalendarEntryDialogue();
  }

  render() {
    return (
      <Dialog
        className="addingredient-dialog"
        aria-labelledby="addIngredient-dialog-title"
        open={this.props.open}
      >
        <DialogTitle className="dialog-title" id="addIngredient-dialog-title">
          Add Calendar Event
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
                type='datetime-local'
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
              Add Calendar Event
            </Button>
          </form>
        </Card>
      </Dialog>
    );
  }
}

export default connector(AddCalendarEntry);
