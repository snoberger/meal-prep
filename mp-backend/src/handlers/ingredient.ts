import { APIGatewayProxyHandler } from "aws-lambda";
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { getPrincipleId } from "../middleware/validation";
import { v4 as uuidv4 } from 'uuid';



interface IngredientTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
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
        data = JSON.parse(event.body) as Record<string, unknown>;
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
    return {statusCode: 200, body: JSON.stringify(data.Item)};
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
    return {statusCode: 200, body: JSON.stringify(data)};
}

