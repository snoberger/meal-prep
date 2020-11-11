
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Ingredient, IngredientData, Ingredients } from './ingredient.types';
export type Timestamp = number;
export type Uuid = string;
export interface RecipeStep {
    description: string,
    type: string,
    resources: string[],
    time: number,
    order: number
}
export interface RecipeRequestBody extends Record<string, string | RecipeRequestBodyArray>{
    userId: Uuid,
    name: string,
    description: string,
    steps: Steps,
    ingredients: Ingredients
}
export type Steps = RecipeStep[]
export interface RecipeTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  id: Uuid,
  userId: Uuid,
  name: string,
  description: string,
  ingredients: IngredientData[],
  steps: Steps
  createTs: Timestamp,
  updateTs: Timestamp
}
export type RecipeRequestBodyArray = Array<RecipeStep | Ingredient>