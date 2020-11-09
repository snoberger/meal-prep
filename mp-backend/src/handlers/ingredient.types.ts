
export type Timestamp = number;
export type Uuid = string;

export type IngredientId = Uuid;
export interface IngredientData {
    id: Uuid,
    amount: number
} 

export type Ingredients = Ingredient[]

export interface Ingredient {
    id?: Uuid,
    amount: number,
    name: string,
    metric: string
}