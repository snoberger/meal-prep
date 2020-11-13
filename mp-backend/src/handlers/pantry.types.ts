import DynamoDB from 'aws-sdk/clients/dynamodb';
import { Ingredient } from './ingredient.types';
export type Timestamp = number;
export type Uuid = string;

export type OptionalRequestBody = {
    id ?: string,
    amount ?: string
    name ?: string
    metric ?: string
}

export interface PantryIngredientData {
    id: Uuid,
    amount: string
}

export interface PantryIngredient extends Ingredient {
    amount: string
}

export interface PantryRequestBody extends Record<string, string | PantryRequestBodyArray> {
    ingredients: PantryIngredient[]
}
export interface PantryTableEntry<I = PantryIngredientData> extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  id: Uuid,
  userId: Uuid,
  ingredients: I[],
  createTs: Timestamp,
  updateTs: Timestamp
}

export type PantryId = Uuid;
export interface PantryRequest {
    pantryId: PantryId,
    ingredient: PantryIngredient | PantryIngredientData,
}

export type PantryRequestBodyArray = Array<PantryRequest | PantryIngredient>