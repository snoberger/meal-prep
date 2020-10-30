import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { v4 as uuidv4 } from 'uuid';
import { authLib } from '../libs/authentication';
import crypto from 'crypto';

type SecureRandomString = string;
type Timestamp = number;
type Uuid = string;

interface UserTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
    id: Uuid,
    userpass: string,
    salt: SecureRandomString,
    createTs: Timestamp,
    updateTs: Timestamp
}

export interface UserRequestBody extends Record<string, string> {
    username: string,
    password: string
}

function isUserRequestBody(data: Record<string, unknown>): data is UserRequestBody {
    return 'username' in data && 'password' in data;
}

export interface UserIdRequestBody extends Record<string, string> {
    id: string
}

function isUserIdRequestBody(data: Record<string, unknown>): data is UserIdRequestBody {
    return 'id' in data;
}


// TODO: move user to id lookup part to library, so that everybody can avoid
// TODO: this exact code is also used in auth.ts
async function userAlreadyExists(username: string) {
    const getUserParams: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'user',
        IndexName: 'userToId',
        KeyConditionExpression: '#username = :usernamePlaceholder',
        ExpressionAttributeNames: {
            '#username': 'username'
        },
        ExpressionAttributeValues: {
            ':usernamePlaceholder': username
        }
    };

    const result: DynamoDB.DocumentClient.QueryOutput = await dynamoLib.query(getUserParams);
    return result.Count != 0;
}

export const create: APIGatewayProxyHandler = async (event) => {

    let data: Record<string, unknown>;
    if (event && event.body) {
        data = JSON.parse(event.body) as Record<string, unknown>;
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({ message: 'Malformed event body' })
        }
    }

    if (!isUserRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Malformed event body' })
        }
    }


    const userRequest: UserRequestBody = data;

    let userExists;
    try {
        userExists = await userAlreadyExists(userRequest.username);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        }
    }

    if (userExists) {
        return {
            statusCode: 409,
            body: JSON.stringify({ message: 'User already exists' })
        }
    }

    const salt = crypto.randomBytes(32).toString('hex');
    let userPassHash: string;
    try {
        userPassHash = await authLib.getHashedCredentials(userRequest.username, userRequest.password, salt);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        }
    }

    const newUser: UserTableEntry = {
        'id': uuidv4(),
        'username': userRequest.username,
        'userpass': userPassHash,
        'salt': salt,
        'createTs': Date.now(),
        'updateTs': Date.now()
    }

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'user',
        Item: newUser,
    }

    try {
        await dynamoLib.put(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        }
    }

    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'success' }),
    };
};


export const deleteUser: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        data = JSON.parse(event.body) as Record<string, unknown>;
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({ message: 'Malformed event body' })
        }
    }

    if (!isUserIdRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: 'Malformed event body' })
        }
    }

    const userIdRequest: UserIdRequestBody = data;

    const deleteParams: DynamoDB.DocumentClient.DeleteItemInput = {
        TableName: 'user',
        Key: {
            'id': userIdRequest.id,
        },
    }

    try {
        await dynamoLib.delete(deleteParams);
    } catch (e) {
        return {
            statusCode: 404,
            body: JSON.stringify({ message: 'Not Found' })
        }
    }
    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'success' }),
    };
};

