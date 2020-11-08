
import DynamoDB from 'aws-sdk/clients/dynamodb';
export type Timestamp = number;
export type Uuid = string;
export interface RecipeStep {
    description: string,
    type: string,
    resources: string[],
    time: number,
    order: number
}
export interface IngredientData {
    id: Uuid,
    amount: number
} 
export type Steps = RecipeStep[]
export interface RecipeTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  id: Uuid,
  userId: Uuid,
  ingredients: IngredientData[],
  steps: Steps
  createTs: Timestamp,
  updateTs: Timestamp
}
export type Ingredients = Ingredient[]
export interface Ingredient {
    id?: string,
    amount: number,
    name: string,
    metric: string
}
export type RecipeRequestBodyArray = Array<RecipeStep | Ingredient>