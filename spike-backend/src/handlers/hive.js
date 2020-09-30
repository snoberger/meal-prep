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
      inspectionResults: data.inspectionResults || null,
      health: data.health || null,
      honeyStores: data.honeyStores || null,
      queenProduction: data.queenProduction || null,
      hiveEquipment: data.hiveEquipment || null,
      inventoryEquipment: data.inventoryEquipment || null,
      losses: data.losses || null,
      gains: data.gains || null,
      createTs: Date.now(),
      updateTs: Date.now()
    }
  };
  await dynamoDb.put(params);
  return params.Item;
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
    return dynamoDb.query(params);

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
    return getSpecifiedHiveHelper(userId, hiveId);
});

export const updateHive = handler(async (event, context) => {
    let data = JSON.parse(event.body);
    let userId = data.userId;
    let hiveId = data.hiveId;

    // let mapping =  {
    //     'attribute1': 'updatedvalue1',
    //     'attribute2': 'updatedvalue2'
    // }
    let mapping = data.values;

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
    return await getSpecifiedHiveHelper(userId, hiveId);
});

export const deleteHive = handler(async (event, context) => {
    let data = JSON.parse(event.body);
    let userId = data.userId;
    let hiveId = data.hiveId;

    const params = {
        TableName: 'hive',
        Key: {
            'hiveId': hiveId,
            'userId': userId
        },
        ReturnValues: 'ALL_OLD'
    }
    return await dynamodbLib.delete(params);
});