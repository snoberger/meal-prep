import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { v4 as uuidv4 } from 'uuid';
import { getPrincipleId } from '../middleware/validation';
import { IngredientTableEntry, updateIngredients } from './ingredient';
import {  RecipeRequestBody, RecipeTableEntry } from './recipe.types'
import {  Ingredient, IngredientData } from './ingredient.types';


function determineRecipeRequestBodyFields(data: Record<string, unknown>): string  {
    if(!('userId' in data)) {
        return "UserId not specified";
    }
    if(!('ingredients' in data)) {
        return "Ingredients not specified";
    }
    if(!('steps' in data)) {
        return "Steps not specified";
    }
    return "";
}
function isRecipeRequestBody(data: Record<string, unknown>): data is RecipeRequestBody {
    return !determineRecipeRequestBodyFields(data);
}

export const createRecipe: APIGatewayProxyHandler = async (event) => {
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
            body: JSON.stringify({message: `Malformed event body: ${determineRecipeRequestBodyFields(data)}`})
        }
    }


    const recipeRequest: RecipeRequestBody = data;

    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    try {
        const ingredients = await updateIngredients(data.ingredients)
        
        const newRecipe: RecipeTableEntry = {
            'id': uuidv4(),
            'userId': userId,
            'steps': recipeRequest.steps,
            'ingredients': ingredients,
            'createTs': Date.now(),
            'updateTs': Date.now()
        }
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'recipe',
            Item: newRecipe,
        }

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

export const getAllRecipes: APIGatewayProxyHandler = async (event) => {
    if(!event || !event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'recipe',
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };
    let data;
    try {
        data = await dynamoLib.query(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    return {statusCode: 200, body: JSON.stringify(data.Items)};
}

export const getRecipe: APIGatewayProxyHandler = async (event) => {
    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.recipeId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const pathParameters = event.pathParameters;
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const recipeId = pathParameters.recipeId;

    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'recipe',
        Key: {
            'userId': userId,
            'id': recipeId
        }
    };
    let data;
    try {
        data = await dynamoLib.get(params);
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    return {statusCode: 200, body: JSON.stringify(data.Item)};
}    

export const updateRecipe: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        try {
            data = JSON.parse(event.body) as Record<string, unknown>;
        } catch(e) {
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
            body: JSON.stringify({message: `Malformed event body: ${determineRecipeRequestBodyFields(data)}`})
        }
    }


    const recipeRequest: RecipeRequestBody = data;

    if(!event || !event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const pathParameters = event.pathParameters;
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const recipeId = pathParameters.recipeId;
    let updatedData;
    try {
        const ingredients = await updateIngredients(recipeRequest.ingredients)

        const params: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: 'recipe',
            Key: {
                'userId': userId,
                'id': recipeId
            },
            UpdateExpression: "set steps = :s, ingredients = :i, updateTs = :t",
            ExpressionAttributeValues:{
                ":s":recipeRequest.steps,
                ":i":ingredients,
                ":t": Date.now()
            },
            ReturnValues:"UPDATED_NEW"
            
        };
        updatedData = await dynamoLib.update(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    return {statusCode: 200, body: JSON.stringify(updatedData)};
}

export const deleteRecipe: APIGatewayProxyHandler = async (event) => {

    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.recipeId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const recipeId = event.pathParameters.recipeId;
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const params:  DynamoDB.DocumentClient.DeleteItemInput= {
        TableName: 'recipe',
        Key: {
            'userId': userId,
            'id': recipeId
        },
        ReturnValues: 'ALL_OLD'
    };
    let data;

    try {
        data = await dynamoLib.delete(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    if(data.ConsumedCapacity) {
        return {statusCode: 404, body: JSON.stringify({message: 'Recipe not found'})};
    }
    return {statusCode: 200, body: JSON.stringify(data)};
}


