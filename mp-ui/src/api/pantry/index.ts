import { Ingredient } from "../../store/pantry/reducers/pantry";

//@ts-ignore
/* eslint-disable */
export async function createPantryIngredient(ingredient: Ingredient): any {
    return  new Promise((resolve,reject) => {
        resolve(
            {
                status: 200,
                data: {
                    message: "success"
            }
        });
       
    })
}