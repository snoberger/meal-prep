import { Recipe } from "../../store/recipes/reducers/recipes";


export interface FetchRecipeListResponse {
    config: {},
    data:  {
        message: Array<Recipe>
    },
    headers: {},
    request: XMLHttpRequest,
    status: number,
    statusText: string
}