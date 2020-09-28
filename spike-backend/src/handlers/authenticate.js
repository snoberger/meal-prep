import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  let data;
  if (event.isOffline) {
    data = event;
  } else {
    data = JSON.parse(event);
  }
  const lookupUserByNameParams = {
    TableName: 'auth',
    IndexName: 'userToId',
    KeyConditionExpression: '#username = :userPlaceholder',
    ExpressionAttributeNames: {
        '#username': 'user'
    },
    ExpressionAttributeValues: {
        ':userPlaceholder': data.user
    }
  };
  let userId = (await dynamoDb.query(lookupUserByNameParams)).Items[0].userId;
  if(!userId) {
    return false;
  }

  const lookupUserPasswordParams = {
      TableName: 'auth',
      Key: {
          'userId': userId
      },
      AttributesToGet: ['pass']
  };

  let password = (await dynamoDb.get(lookupUserPasswordParams)).Item.pass;
  if(password == data.pass) {
      return true;
  } else {
      return false;
  }
});
