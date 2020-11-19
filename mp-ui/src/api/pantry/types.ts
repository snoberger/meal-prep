import { PantryObject } from "../../store/pantry/reducers/pantry";

export interface unIndexedIngredient {
    name: string,
    amount: string,
    metric: string
}
export interface FetchPantryResponse {
    config: {},
    data:  PantryObject,
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}