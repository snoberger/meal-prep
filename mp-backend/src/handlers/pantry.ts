import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { v4 as uuidv4 } from 'uuid';
import { getPrincipleId } from '../middleware/validation';

type Timestamp = number;
type Uuid = string;

type IngredientId = Uuid;
interface PantryTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  id: Uuid,
  userId: Uuid,
  ingredientId: IngredientId,
  quantity: string,
  createTs: Timestamp,
  updateTs: Timestamp
}

export const createPantry: APIGatewayProxyHandler = async (event) => {

    if(!event || !event.pathParameters || !event.pathParameters.ingredientId || !event.pathParameters.quantity) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body`})
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

    const ingredientId = event.pathParameters.ingredientId;
    const quantity = event.pathParameters.quantity;

    const newPantry: PantryTableEntry = {
        'id': uuidv4(),
        'userId': userId,
        'ingredientId': ingredientId,
        'quantity': quantity,
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
    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.pantryId) {
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
    const pantryId = pathParameters.pantryId;

    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'pantry',
        Key: {
            'userId': userId,
            'id': pantryId
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

export const updatePantry: APIGatewayProxyHandler = async (event) => {

    if(!event || !event.pathParameters || !event.pathParameters.pantryId || !event.pathParameters.quantity) {
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

    const params: DynamoDB.DocumentClient.UpdateItemInput = {
        TableName: 'pantry',
        Key: {
            'userId': userId,
            'id': event.pathParameters.pantryId
        },
        UpdateExpression: "set quantity = :q, updateTs = :t",
        ExpressionAttributeValues:{
            ":q": event.pathParameters.quantity,
            ":t": Date.now()
        },
        ReturnValues:"UPDATED_NEW"
        
    };
    let updatedData;
    try {
        updatedData = await dynamoLib.update(params);
    } catch (e) {
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

// I'm leaving this commented out because I don't think it is necessary, but in case the way we go about implementing
// this endpoint changes, the code will be here for ease of access. I.E. We don't currently use the event body for anything
// on this endpoint, as you can define an ingredientID and quantity through path parameters. There is no complex data structure
// necessary like there is for a recipe.

// type PantryId = Uuid;
// interface PantryRequest {
//     pantryId: PantryId,
//     ingredientId: IngredientId,
//     quantity: string
// }

// type PantryRequestBodyArray = Array<PantryRequest>

// export interface PantryRequestBody extends Record<string, string | PantryRequestBodyArray> {
//     pantryId: PantryId
//     ingredientId: IngredientId,
//     quantity: string
// }

// function determinePantryRequestBodyFields(data: Record<string, unknown>): string  {
//     if(!('userId' in data)) {
//         return "UserId not specified";
//     }
//     if(!('pantryId' in data)) {
//         return "PantryId not specified";
//     }
//     if(!('ingredientId' in data)) {
//         return "Ingredient not specified";
//     }
//     if(!('quantity' in data)) {
//         return "Quantity not specified";
//     }
//     return "";
// }

// function isPantryRequestBody(data: Record<string, unknown>): data is PantryRequestBody {
//     return !determinePantryRequestBodyFields(data);
// }