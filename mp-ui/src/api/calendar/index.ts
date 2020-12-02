import {ENDPOINT} from '../const';
import axios from 'axios';
import { getConfig } from '../middleware';
import { FetchCalendarListResponse, FetchCalendarResponse, PostCalendarListResponse } from './types';
import { CalendarEntry } from '../../store/calendar/reducers/calendar';
export * from './types';

export const CALENDAR_ENDPOINT = `${ENDPOINT}/calendar/`;

export async function fetchAllCalendarEntries(userId: string): Promise<FetchCalendarListResponse> {
    return await axios.get(CALENDAR_ENDPOINT + `${userId}`, getConfig());
}

export async function fetchCalendarEntry(userId: string, calendarId: string): Promise<FetchCalendarResponse> {
    return await axios.get(CALENDAR_ENDPOINT + `${userId}/${calendarId}`, getConfig());
}
export async function createCalendar(calendar: CalendarEntry): Promise<PostCalendarListResponse> {
    return await axios.post(CALENDAR_ENDPOINT, calendar, getConfig());
}

export async function editCalendar(calendar: CalendarEntry, userId: string): Promise<PostCalendarListResponse> {
    return await axios.put(CALENDAR_ENDPOINT + `${userId}/${calendar.id}`, calendar, getConfig());
}

export async function deleteCalendar(calendar: CalendarEntry, userId: string): Promise<PostCalendarListResponse> {
    return await axios.delete(CALENDAR_ENDPOINT + `${userId}/${calendar.id}`, getConfig());
}