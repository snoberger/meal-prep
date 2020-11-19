
export type Timestamp = number;
export type Uuid = string;

export type IngredientId = Uuid;
export interface IngredientData {
    id: Uuid,
    amount: string
} 

export type Ingredients = Ingredient[]

export interface Ingredient extends Record<string, unknown> {
    id?: Uuid,
    amount: string,
    name: string,
    metric: string
}