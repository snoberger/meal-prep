import { Recipe } from "../../store/recipes/reducers/recipes";


export interface FetchRecipeListResponse {
    config: {},
    data: {
        message: Array<Recipe>
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}

export interface PostRecipeListResponse {
    config: {},
    data: {
        message: string
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}
export interface DeleteRecipeListResponse {
    config: {},
    data: {
        message: string
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}