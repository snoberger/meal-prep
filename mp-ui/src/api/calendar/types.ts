import { CalendarEntry } from "../../store/calendar/reducers/calendar";


export interface FetchCalendarListResponse {
    config: {},
    data:  {
        message: Array<CalendarEntry>
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}
export interface FetchCalendarResponse {
    config: {},
    data:  {
        message: CalendarEntry
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export interface PostCalendarListResponse {
    config: {},
    data:  {
        message: string
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}