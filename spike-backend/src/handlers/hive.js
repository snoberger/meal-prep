import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
import dynamodbLib from "../libs/dynamodb-lib";

export const create = handler(async (event, context) => {
  let data = JSON.parse(event.body);
  const params = {
    TableName: 'hive',
    Item: {
      userId: data.userId,
      hiveId: uuid.v1(),
      name: data.name,
      image: data.image || 'none',
      inspectionResults: data.inspectionResults || null,
      health: data.health || null,
      honeyStores: data.honeyStores || null,
      queenProduction: data.queenProduction || null,
      hiveEquipment: data.hiveEquipment || null,
      inventoryEquipment: data.inventoryEquipment || null,
      losses: data.losses || null,
      gains: data.gains || null,
      viewable: data.viewable || null,
      createTs: Date.now(),
      updateTs: Date.now()
    }
  };
  await dynamoDb.put(params);
  return {statusCode: 201, body: params.Item};
});

export const getUsersHives = handler(async (event, context) => {
    let userId = event.pathParameters.userId;
    const params = {
        TableName: 'hive',
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };
    let data = await dynamoDb.query(params);
    return {statusCode: 200, body: data};
});

function getSpecifiedHiveHelper(userId, hiveId) {
    const params = {
        TableName: 'hive',
        KeyConditionExpression: '#userId = :userId AND #hiveId = :hiveId',
        ExpressionAttributeNames: {
            '#userId': 'userId',
            '#hiveId': 'hiveId'
        },
        ExpressionAttributeValues: {
            ':userId': userId,
            ':hiveId': hiveId
        }
    };
    return dynamoDb.query(params);
}

export const getSpecifiedHive = handler(async (event, context) => {
    let userId = event.pathParameters.userId;
    let hiveId = event.pathParameters.hiveId;
    // TODO: check if id(s) exists => 200 else => 404 (Not Found)
    return {statusCode: 200, body: await getSpecifiedHiveHelper(userId, hiveId)};
});

export const updateHive = handler(async (event, context) => {
    let data = JSON.parse(event.body);
    let userId = event.pathParameters.userId;
    let hiveId = event.pathParameters.hiveId;
    console.log(data)
    // let mapping =  {
    //     'attribute1': 'updatedvalue1',
    //     'attribute2': 'updatedvalue2'
    // }
    let mapping = data;

    let params = (attributeName, attributeValue) => ({
        TableName: 'hive',
        Key: {
            'hiveId': hiveId,
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

    // I couldn't find a better way to do this. Wait for each attribute to be updated, (one by one)
    // then get the item'sc urrent state and return that. You can set update to return certain things
    // but I wasn't able to find a way to cleanly return the item with all the updates applied through
    // that API. i.e. Not all changes were reflected in the most recent item due to races? in the
    // database. - ctfloyd
    await Promise.all(updatePromises);

    // TODO: 404 if couldn't find hive
    return {statusCode: 200, body: await getSpecifiedHiveHelper(userId, hiveId)};
});

export const deleteHive = handler(async (event, context) => {
    let userId = event.pathParameters.userId;
    let hiveId = event.pathParameters.hiveId;
    const params = {
        TableName: 'hive',
        Key: {
            'hiveId': hiveId,
            'userId': userId
        },
        ReturnValues: 'ALL_OLD'
    };
    // TODO: 404 if id not found
    return {statusCode: 200, body: await dynamodbLib.delete(params)};
});