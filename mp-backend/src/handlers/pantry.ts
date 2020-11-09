import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { v4 as uuidv4 } from 'uuid';
import { getPrincipleId } from '../middleware/validation';
import { OptionalRequestBody, PantryIngredient, PantryRequestBody, PantryTableEntry } from './pantry.types';
import { updateIngredients } from './ingredient';


function determinePantryRequestBodyFields(data: Record<string, unknown>): string  {
    const ingredients: Array<OptionalRequestBody> = (data.ingredients as Array<OptionalRequestBody>)
    if(ingredients && Array.isArray(ingredients)){
        for( const ingredient of ingredients) {
            if(!ingredient || !ingredient.amount
                || !ingredient.name
                || !ingredient.metric) {
                return "Ingredient in body malformed";
            }
        }
    } else {
        return "Ingredients not specified";
    }
    
    return "";
}

function determinePantryUpdateRequestBodyFields(data: Record<string, unknown>): string  {
    
    const ingredients: Array<OptionalRequestBody> = (data.ingredients as Array<OptionalRequestBody>)
    
    if(ingredients && Array.isArray(ingredients) && ingredients.length !== 0){
        for( const ingredient of ingredients) {
            if(ingredient.id){
                if(!ingredient.amount){
                    return "Ingredient in body malformed";
                }
            } else {
                if(!ingredient.amount
                    || !ingredient.name
                    || !ingredient.metric) {
                    return "Ingredient in body malformed";
                }
            }
        }
    } else {
        return "Ingredients not specified";
    }
    return "";
}

function isPantryRequestBody(data: Record<string, unknown>): data is PantryRequestBody {
    return !determinePantryRequestBodyFields(data);
}

function isPantryRequestUpdateBody(data: Record<string, unknown>): data is PantryRequestBody {
    return !determinePantryUpdateRequestBodyFields(data);
}

export const createPantry: APIGatewayProxyHandler = async (event) => {

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

    if(!isPantryRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determinePantryRequestBodyFields(data)}`})
        }
    }


    const recipeRequest: PantryRequestBody = data;

    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }

    const ingredients = recipeRequest.ingredients;
    
    try {
        const ingredientData = await updateIngredients(ingredients)

        const newPantry: PantryTableEntry = {
            'id': uuidv4(),
            'userId': userId,
            'ingredients': ingredientData,
            'createTs': Date.now(),
            'updateTs': Date.now()
        }

        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'pantry',
            Item: newPantry,
        }

        try {
            await dynamoLib.put(params);
        } catch (e) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal server error'})
            }
        }
    }
    catch (e) {
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

export const getAllPantry: APIGatewayProxyHandler = async (event) => {
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
        TableName: 'pantry',
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

export const getPantry: APIGatewayProxyHandler = async (event) => {
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.pantryId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    const pathParameters = event.pathParameters;
    const pantryId = pathParameters.pantryId;

    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'pantry',
        Key: {
            'userId': userId,
            'id': pantryId
        }
    };
    let pantryItem: PantryTableEntry<PantryIngredient> | undefined = undefined;
    try {
        const response = await dynamoLib.get(params);
        if(response.Item && response.Item.ingredients) {
            const item: any = response.Item
            pantryItem = item
        }
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    if(pantryItem) {
        const ingredients = pantryItem.ingredients
        let ingredientData: PantryIngredient[] = []
        try {
            const params: DynamoDB.DocumentClient.BatchGetItemInput = {
                RequestItems:  {
                    "ingredient": {
                        Keys: ingredients.map((item) => {
                            return {
                                "id": item.id
                            }
                        })
                    }
                }
            };
        
            const response = await dynamoLib.batchGet(params);
            if(response.Responses && response.Responses["ingredient"]) {
                const ingredientsResponse: any = response.Responses['ingredient']
                ingredientData = ingredientsResponse
            }
        } catch (e) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal server error', e})
            }
        }
        pantryItem.ingredients = ingredientData
    }
    return {statusCode: 200, body: JSON.stringify(pantryItem)};
}    

export const updatePantry: APIGatewayProxyHandler = async (event) => {
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    if(!event || !event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
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

    if(!isPantryRequestUpdateBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determinePantryUpdateRequestBodyFields(data)}`})
        }
    }
    const pantryRequest: PantryRequestBody = data;

    let updatedData;
    try {
        
        await updateIngredients(pantryRequest.ingredients.filter((ingredient: PantryIngredient)=>(!ingredient.id)))
            
        const params: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: 'pantry',
            Key: {
                'userId': userId,
                'id': event.pathParameters.pantryId
            },
            UpdateExpression: "set ingredient = :i, updateTs = :t",
            ExpressionAttributeValues:{
                ":i": pantryRequest.ingredients,
                ":t": Date.now()
            },
            ReturnValues:"UPDATED_NEW"
            
        };
        try {
            updatedData = await dynamoLib.update(params);
        } catch (e) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal server error'})
            }
        }
    } catch(e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    return {statusCode: 200, body: JSON.stringify(updatedData)};
}

export const deletePantry: APIGatewayProxyHandler = async (event) => {

    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.pantryId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const pantryId = event.pathParameters.pantryId;
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
        TableName: 'pantry',
        Key: {
            'userId': userId,
            'id': pantryId
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
        return {statusCode: 404, body: JSON.stringify({message: 'Pantry not found'})};
    }
    return {statusCode: 200, body: JSON.stringify(data)};
}