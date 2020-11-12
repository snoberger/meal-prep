import { PantryObject } from "../../store/pantry/reducers/pantry";


export interface FetchPantryResponse {
    config: {},
    data:  PantryObject,
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}