import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { authLib } from '../libs/authentication';
import { getPrincipleId } from '../middleware/validation';

interface AuthEventBody extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
    username: string,
    password: string
}

function isAuthEventBody(data: Record<string, unknown>): data is AuthEventBody {
    return 'username' in data && 'password' in data && Object.keys(data).length == 2;
}

async function getIdFromUsername(username: string) {
    const getUserParams: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'user',
        IndexName: 'userToId',
        KeyConditionExpression: '#username = :usernamePlaceholder',
        ExpressionAttributeNames : {
            '#username': 'username'
        },
        ExpressionAttributeValues: {
            ':usernamePlaceholder': username
        }
    };

    return await dynamoLib.query(getUserParams);
}

async function getUserpassAndSalt(userId: string) {
    const getUserPassAndSalt: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'user',
        Key: {
            'id': userId
        },
        AttributesToGet: ['userpass', 'salt']
    };
    
    return await dynamoLib.get(getUserPassAndSalt);
}

export const authenticate: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        try {
            data = JSON.parse(event.body) as Record<string, unknown>;
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({message: 'Malformed request body'})
            }
        }
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({message: 'Bad request'})
        }
    }

    if(!isAuthEventBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Bad request'})
        }
    }

    const authRequest: AuthEventBody = data;
    let result;
    try {
        result = await getIdFromUsername(authRequest.username);
    } catch(e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    if(!result || !result.Items || result.Count == null || result.Count > 1) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    if(result.Count == 0) {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'User does not exist'})
        }
    }

    const user: DynamoDB.AttributeMap = result.Items[0];
    let userId: string;
    let pantryId: string;
    if(user && user.id) {
        userId = user.id as string;
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    if(user && user.pantryId) {
        pantryId = user.pantryId as string;
    } else {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    
    let userpassResult: DynamoDB.GetItemOutput;
    try {
        userpassResult = await getUserpassAndSalt(userId);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    if(!userpassResult || !userpassResult.Item) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    interface UserPassItem {
        'userpass': string,
        'salt': string
    }
    const item: UserPassItem = <unknown>userpassResult.Item as UserPassItem;

    const userpassHash = item.userpass;
    const salt = item.salt;

    let computedHash: string;
    try {
        computedHash = await authLib.getHashedCredentials(authRequest.username, authRequest.password, salt);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    if(computedHash != userpassHash) {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Login failure'})
        }
    }

    let JWTToken;
    try {
        JWTToken = authLib.generateJWT(userId);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({authToken: JWTToken, userId: userId, pantryId: pantryId})
    }
};

export const authenticateToken: APIGatewayProxyHandler = async (event) => {
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    return Promise.resolve({
        statusCode: 200,
        body: JSON.stringify({message: userId })
    });
}