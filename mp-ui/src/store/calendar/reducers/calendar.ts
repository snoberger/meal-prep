import {POST_CALENDAR, POST_CALENDAR_ERROR, FETCH_CALENDAR_ERROR, FETCH_CALENDAR_LIST_ERROR, SET_CALENDAR_ENTRY_LIST, SET_CALENDAR_ENTRY, TOGGLE_ADDDIALOGUE} from '../actionTypes';
import { State } from '../../rootReducer';

export type CalendarEntry = {
    id?: string,
    date: Date,
    description: string,
    notify: string
}

const initialState = {
    // eslint-disable-next-line
    calendarEntryList: [],
    // eslint-disable-next-line
    calendarEntry: {
        id: '',
        date: Date.now(),
        description: '',
        notify: ''
    },
    componentState: 'view',
    displayAddcalendarEntryDialogue: false,
    displayEditcalendarEntryDialogue: false
};

const calendar = (state = initialState, action: any) => {
    switch (action.type) {
        case POST_CALENDAR_ERROR:
            return {
                ...state
            };
        case POST_CALENDAR:
            return {
                ...state
            };
        case SET_CALENDAR_ENTRY:
            return {
                ...state,
                calendarEntry: action.calendarEntry
            };
        case TOGGLE_ADDDIALOGUE:
            return {
                ...state,
                displayAddcalendarEntryDialogue: !state.displayAddcalendarEntryDialogue
            };
        case SET_CALENDAR_ENTRY_LIST:
            return {
                ...state,
                calendarEntryList: action.calendarEntryList
            };
        case FETCH_CALENDAR_LIST_ERROR:
            return {
                ...state,
            };
        case FETCH_CALENDAR_ERROR:
            return {
                ...state,
            };
        default:
            return {...state};
    }
};

export const getCalendarEntryList = (state: State) => {
    return state.calendar.calendarEntryList;
};
export const getCalendarEntry = (state: State) => {
    return state.calendar.calendarEntry;
};
export const getAddCalendarEntryDialogueOpen = (state: State) => {
    return state.calendar.displayAddcalendarEntryDialogue;
};

export const getEditCalendarEntryDialogueOpen = (state: State) => {
    return state.calendar.displayEditcalendarEntryDialogue;
};

export const getComponentState = (state: State): string => {
    return state.recipes.componentState;
};
export default calendar;