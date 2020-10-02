import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import dynamodbLib from "../libs/dynamodb-lib";

export const create = handler(async (event, context) => {
    let data = JSON.parse(event.body);
    const params = {
      TableName: 'auth',
      Item: {
        userId: uuid.v1(),
        user: data.user,
        image: 'none',
        pass: data.pass,
        address: data.address,
        email: data.email,
        createTs: Date.now(),
        updateTs: Date.now()
      }
    };
    await dynamoDb.put(params);
    return {statusCode: 201, body: params.Item};
  });

export const getUser = handler(async (event, context) => {
    let userId = event.pathParameters.userId;
    const params = {
        TableName: 'auth',
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };
    let data = await dynamoDb.query(params);
    return {statusCode: 200, body: data.Items[0]};
});

export const getAllUsers = handler(async (event, context) => {
    const params = {
        TableName: 'auth',
        AttributesToGet: ["userId", "user"]
    };
    let data = await dynamoDb.scan(params);
    return {statusCode: 200, body: data.Items};
});

export const updateUser = handler(async (event, context) => {
    let data = JSON.parse(event.body);
    let userId = event.pathParameters.userId;

    let mapping = data;

    let params = (attributeName, attributeValue) => ({
        TableName: 'auth',
        Key: {
            'userId': userId
        },
        UpdateExpression: 'SET #attribute=:value, #time=:time',
        ConditionExpression: 'attribute_exists(#attribute)',
        ExpressionAttributeNames: {
            '#attribute': attributeName,
            '#time': 'updateTs'
        },
        ExpressionAttributeValues: {
            ':value': attributeValue,
            ':time': Date.now()
        }
    });

    let updatePromises = [];
    for(let attribute in mapping) {
        let value = mapping[attribute];
        updatePromises.push(dynamoDb.update(params(attribute, value)));
    }

    await Promise.all(updatePromises);

    // TODO: 404 if couldn't find user
    return {statusCode: 200, body: userId};
});

export const deleteUser = handler(async (event, context) => {
    let userId = event.pathParameters.userId;

    const params = {
        TableName: 'auth',
        Key: {
            'userId': userId,
        },
        ReturnValues: 'ALL_OLD'
    };
    // TODO: 404 if id not found
    return {statusCode: 200, body: await dynamodbLib.delete(params)};
});