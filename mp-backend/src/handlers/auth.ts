import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { authLib } from '../libs/authentication';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda/trigger/api-gateway-authorizer'
import { APIGatewayProxyResult } from 'aws-lambda/trigger/api-gateway-proxy'
import { authenticateJWT } from '../middleware/authenticateJWT'

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
        data = JSON.parse(event.body) as Record<string, unknown>;
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
    if(user && user.id) {
        userId = user.id as string;
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
        body: JSON.stringify({message: JWTToken})
    }
};

export const authenticateToken: APIGatewayProxyHandler = (event, context) => {
    if(!event || !event.pathParameters || !event.pathParameters.token || !event.requestContext.identity.userArn) {
        return Promise.resolve({
            statusCode: 401,
            body: JSON.stringify({message: "Unauthorized"})
        });
    }
    
    const token = event.pathParameters.token;
    const authenticateEvent: APIGatewayTokenAuthorizerEvent = {
        authorizationToken: 'bearer ' + token,
        type: 'TOKEN',
        methodArn: event.requestContext.identity.userArn
    }

    let result: APIGatewayProxyResult = {
        statusCode: 401,
        body: JSON.stringify({message: "Unauthorized"})
    };

    authenticateJWT(authenticateEvent, context, (err) => {
        if(!err) {
            result =  {
                statusCode: 200,
                body: JSON.stringify({message: "Authorized"})
            }
        }
    });

    return Promise.resolve(result);
}