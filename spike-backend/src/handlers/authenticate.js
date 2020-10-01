import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  let data = JSON.parse(event.body);
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
  let userId;
  try {
    userId = (await dynamoDb.query(lookupUserByNameParams)).Items[0].userId;
    if(!userId) {
      return {statusCode: 200, body: false};
    }
  } catch(e) {
    return {statusCode: 200, body: false};
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
      return {statusCode: 200, body: userId};
  } else {
      return {statusCode: 200, body: false};
  }
});
