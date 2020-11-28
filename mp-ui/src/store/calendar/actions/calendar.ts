import { createCalendar, fetchAllCalendarEntries, fetchCalendarEntry } from '../../../api/calendar';
import { SET_COMPONENT_STATE_ADD } from '../../recipes/actionTypes';
import {POST_CALENDAR, POST_CALENDAR_ERROR, FETCH_CALENDAR_ERROR, FETCH_CALENDAR_LIST_ERROR, SET_CALENDAR_ENTRY_LIST, SET_CALENDAR_ENTRY, TOGGLE_EDITDIALOGUE, TOGGLE_ADDDIALOGUE, SET_COMPONENT_STATE} from '../actionTypes';
import { CalendarEntry } from '../reducers/calendar';

export const setCalendarList = (calendarEntryList: any) => {
  return {
    type: SET_CALENDAR_ENTRY_LIST,
    calendarEntryList
  };
};

export const setCalendarEntry = (calendarEntry: any) => {
  return {
    type: SET_CALENDAR_ENTRY,
    calendarEntry
  };
};

export const fetchCalendarListError = () => {
  return {
    type: FETCH_CALENDAR_LIST_ERROR,
  };
};

export const fetchCalendarEntryError = () => {
  return {
    type: FETCH_CALENDAR_ERROR,
  };
};

export const setComponentState = (componentState: string) => {
  if(componentState === 'add'){
    return {
      type: SET_COMPONENT_STATE_ADD,
      componentState
    };
  }
  return {
    type: SET_COMPONENT_STATE,
    componentState
  };
};

export function handleFetchAllCalendarEntries(userId: string) {
  return async (dispatch: any) => {
    try{
      return await fetchAllCalendarEntries(userId).then((response: any) => {
        if(response.status === 200 && response.data) {
          //todo cast and validate this
          return dispatch(setCalendarList(response.data));
        }
        return dispatch(fetchCalendarListError());
      });
    } catch(e) {
      return dispatch(fetchCalendarListError());
    }
  };
}

export function handleFetchCalendarEntry(userId: string, calendarId: string) {
  return async (dispatch: any) => {
    try{
      return await fetchCalendarEntry(userId, calendarId).then((response: any) => {
        if(response.status === 200 && response.data) {
          //todo cast and validate this
          return dispatch(setCalendarEntry(response.data));
        }
        return dispatch(fetchCalendarEntryError());
      });
    } catch(e) {
      return dispatch(fetchCalendarEntryError());
    }
  };
}

export const postedCalendar = () => {
  return {
    type: POST_CALENDAR,
  };
};

export const postCalendarError = () => {
  return {
    type: POST_CALENDAR_ERROR,
  };
};

export function handleCreateCalendar(calendar: CalendarEntry, userId: string) {
  return async (dispatch: any) => {
    try{
      return await createCalendar(calendar).then((response: any) => {
        if(response.status === 201 && response.data.message) {
          //todo cast and validate this
          
          dispatch(handleFetchAllCalendarEntries(userId));
          return dispatch(postedCalendar());
        }
        return dispatch(postCalendarError());
      });
    } catch(e) {
      return dispatch(postCalendarError());
    }
  };
}


export const toggleAddCalendarEntryDialogue = () => {
  return {
    type: TOGGLE_ADDDIALOGUE,
  };
};

export const toggleEditCalendarEntryDialogue = (calendarEntry: CalendarEntry) => {
  return {
    type: TOGGLE_EDITDIALOGUE,
    calendarEntry: calendarEntry
  };
};