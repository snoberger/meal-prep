import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';

interface AuthEventBody extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
  userId: string,
  userpass: string,
  createTs: number,
  updateTs: number
}

function isAuthEventBody(data: Record<string, unknown>): data is AuthEventBody {
    return 'userId' in data && 'userpass' in data && Object.keys(data).length == 2;
}

export const createUser: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        data = JSON.parse(event.body) as Record<string, unknown>;
    } else {
        return {
            // TODO: correct status code
            statusCode: 404,
            body: JSON.stringify({message: 'failure'})
        }
    }

    if(!isAuthEventBody(data)) {
        return {
            statusCode: 404,
            body: JSON.stringify({message: 'failure'})
        }
    }

    data.createTs = Date.now();
    data.updateTs = Date.now();

    const params: DynamoDB.DocumentClient.PutItemInput = {
        TableName: 'auth',
        Item: data,
    }
    await dynamoLib.put(params);
    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'success' }),
    };
};
