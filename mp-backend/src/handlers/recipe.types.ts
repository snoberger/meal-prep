
import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Ingredient, Ingredients } from './ingredient.types';
export type Timestamp = number;
export type Uuid = string;
export interface RecipeStep {
    description: string,
    type: string,
    resources: string[],
    time: number,
    order: number
}

export interface RecipiesResponseBody extends Record<string, string>{
  id: Uuid,
  name: string,
  description: string
}
export interface RecipeIngredientData {
  id: Uuid,
  amount: number
}

export interface RecipeIngredient extends Ingredient {
  amount: number
}


export interface RecipeRequestBody extends Record<string, string | RecipeRequestBodyArray>{
    userId: Uuid,
    name: string,
    description: string,
    steps: Steps,
    ingredients: Ingredients
}
export type Steps = RecipeStep[]
export interface RecipeTableEntry<I = RecipeIngredientData> extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  id: Uuid,
  userId: Uuid,
  name: string,
  description: string,
  ingredients: I[],
  steps: Steps
  createTs: Timestamp,
  updateTs: Timestamp
}
export type RecipeRequestBodyArray = Array<RecipeStep | Ingredient>