import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { v4 as uuidv4 } from 'uuid';

type Timestamp = number;
type Uuid = string;
interface RecipeStep {
    description: string,
    type: string,
    resources: string[],
    time: number,
    order: number,
}
type Steps = RecipeStep[]
interface RecipeTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  id: Uuid,
  userId: Uuid,
  ingredients: Ingredients,
  steps: Steps
  createTs: Timestamp,
  updateTs: Timestamp
}
type Ingredients = Ingredient[]
interface Ingredient {
    name: string
}
type RecipeRequestBodyArray = Array<RecipeStep | Ingredient>
export interface RecipeRequestBody extends Record<string, string | RecipeRequestBodyArray>{
    userId: Uuid,
    steps: Steps,
    ingredients: Ingredients
}
function determineRecipeRequestBodyFields(data: Record<string, unknown>): string | undefined {
    if(!('userId' in data)) {
        return "UserId not specified"
    }
    if(!('ingredients' in data)) {
        return "Ingredients not specified"
    }
    if(!('steps' in data)) {
        return "Ingredients not specified"
    }
    return
}
function isRecipeRequestBody(data: Record<string, unknown>): data is RecipeRequestBody {
    return !determineRecipeRequestBodyFields(data)
}

export const create: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        try {
            data = JSON.parse(event.body) as Record<string, unknown>;
        } catch (e) {
            return {
                // TODO: correct status code
                statusCode: 400,
                body: JSON.stringify({message: 'Malformed event body'})
            }
        }
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }

    if(!isRecipeRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determineRecipeRequestBodyFields(data) || "None"}`})
        }
    }


    const recipeRequest: RecipeRequestBody = data;

    const newRecipe: RecipeTableEntry = {
        'id': uuidv4(),
        'userId': recipeRequest.userId,
        'steps': recipeRequest.steps,
        'ingredients': recipeRequest.ingredients,
        'createTs': Date.now(),
        'updateTs': Date.now()
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'recipe',
        Item: newRecipe,
    }

    try {
        await dynamoLib.put(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'success' }),
    };
};


