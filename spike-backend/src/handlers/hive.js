import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const create = handler(async (event, context) => {
  let data = JSON.parse(event.body);

  console.log(data);
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

export const getSpecifiedHive = handler(async (event, context) => {
    let userId = event.pathParameters.userId;
    let hiveId = event.pathParameters.hiveId;

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
});
