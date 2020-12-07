import { APIGatewayProxyHandler } from "aws-lambda";
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { getPrincipleId } from "../middleware/validation";
import { v4 as uuidv4 } from 'uuid';
import { Ingredient, IngredientData } from "./ingredient.types";


export function determineIngredientResponseFields(data: Record<string, unknown>[]): string  {
    if(data && Array.isArray(data)){
        for( const ingredient of data) {
            if(!ingredient
                ||!Object.keys(ingredient).includes('name') 
                || !Object.keys(ingredient).includes('metric') ) {
                return "Ingredient in body malformed";
            }
        }
    }
    else {
        return "Ingredient in body malformed"
    }
    
    return "";
}
export function isIngredientResponse(data: Record<string, unknown>[]): data is IngredientTableEntry[] {
    return !determineIngredientResponseFields(data);
}
export interface IngredientTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
    id: string,
    name: string,
    metric: string,
    createTs: number,
}


export interface IngredientRequestBody extends Record<string, string>{
    name: string,
    metric: string
}

function isIngredientRequestBody(data: Record<string, unknown>): data is IngredientRequestBody {
    return !determineIngredientRequestBodyFields(data);
}

function determineIngredientRequestBodyFields(data: Record<string, unknown>): string  {
    if(!('name' in data)) {
        return "name not specified";
    }
    if(!('metric' in data)) {
        return "metric not specified";
    }  
    return "";
}

export const createIngredient: APIGatewayProxyHandler = async (event) => {
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

    if(!isIngredientRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determineIngredientRequestBodyFields(data)}`})
        }
    }
    const ingredientRequest: IngredientRequestBody = data;

    try {
        getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }

    const newIngredient: IngredientTableEntry = {
        'id': uuidv4(),
        'name': ingredientRequest.name,
        'metric': ingredientRequest.metric,
        'createTs': Date.now()
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'ingredient',
        Item: newIngredient,
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
export async function updateIngredients(ingredients: Ingredient[]): Promise<IngredientData[]> {
    const ingredientReturn: IngredientData[] = []
    for(let i = 0; i < ingredients.length; i++) {
        const queryParams: DynamoDB.DocumentClient.QueryInput = {
            TableName: 'ingredient',
            Select: 'ALL_PROJECTED_ATTRIBUTES',
            IndexName: 'nameToId',
            KeyConditionExpression: '#name = :namePlaceholder',
            ExpressionAttributeNames: {
                '#name':'name'
            },
            ExpressionAttributeValues: {
                ':namePlaceholder' : ingredients[i].name
            },
        };
        let data;
        try {

            data = await dynamoLib.query(queryParams);
            // Update existing
            if(data && data.Items && data.Items.length > 0){
                const oldIngredient = data.Items[0]
                ingredientReturn.push({
                    id: String(oldIngredient.id),
                    amount: ingredients[i].amount
                })
                continue
            }
            // Create new
            const newIngredient: IngredientTableEntry = {
                'id': uuidv4(),
                'name': ingredients[i].name,
                'metric': ingredients[i].metric,
                'createTs': Date.now()
            }
            const params: DynamoDB.DocumentClient.PutItemInput = {
                TableName: 'ingredient',
                Item: newIngredient
            }
        
            try {
                await dynamoLib.put(params);
                ingredientReturn.push({
                    id: newIngredient.id,
                    amount: ingredients[i].amount
                })
            } catch (e) {
                throw {
                    statusCode: 500,
                    body: JSON.stringify({message: 'Internal server error'})
                }
            }
        } catch (e) {
            throw {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal server error'})
            }
        }
    }
    return ingredientReturn
}

export const getIngredient: APIGatewayProxyHandler = async (event) => {
    if(!event || !event.pathParameters ||  !event.pathParameters.ingredientId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const pathParameters = event.pathParameters;

    try {
        getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const ingredientId = pathParameters.ingredientId;

    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'ingredient',
        Key: {
            'id': ingredientId
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
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }, 
        body: JSON.stringify(data.Item)};
}    

export const deleteIngredient: APIGatewayProxyHandler = async (event) => {

    if(!event || !event.pathParameters ||  !event.pathParameters.ingredientId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }

    const pathParameters = event.pathParameters;
    
    try {
        getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }

    const ingredientId = pathParameters.ingredientId;

    const params:  DynamoDB.DocumentClient.DeleteItemInput= {
        TableName: 'ingredient',
        Key: {
            'id': ingredientId
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
        return {statusCode: 404, body: JSON.stringify({message: 'Ingredient not found'})};
    }
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true,
        }, 
        body: JSON.stringify(data)};
}

