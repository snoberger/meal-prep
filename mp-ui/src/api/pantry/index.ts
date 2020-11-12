import { Ingredient } from "../../store/pantry/reducers/pantry";

/* eslint-disable */
//@ts-ignore
export async function createPantryIngredient(ingredient: Ingredient): Promise {
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

/* eslint-disable */
//@ts-ignore
export async function editPantryIngredientApi(ingredient: Ingredient): Promise {
    return new Promise((resolve,reject) => {
        resolve(
            {
                status: 200,
                data: {
                    message: "success"
            }
        });
    });
}