import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  let data;
  if (event.isOffline) {
    data = event;
  } else {
    data = JSON.parse(event);
  }
  const params = {
    TableName: 'auth',
    Item: {
      userId: uuid.v1(),
      user: data.user,
      pass: data.pass,
      createTs: Date.now(),
      updateTs: Date.now()
    }
  };
  await dynamoDb.put(params);
  return params.Item;
});