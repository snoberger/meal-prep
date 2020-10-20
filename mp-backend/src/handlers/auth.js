import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";

export const createUser = handler(async (event, context) => {
  let data = JSON.parse(event.body);
  const params = {
    TableName: 'hive',
    Item: {
      userId: data.userId,
      userpass: data.userpass,
      createTs: Date.now(),
      updateTs: Date.now()
    }
  };
  await dynamoDb.put(params);
  return {statusCode: 201, body: params.Item};
});
