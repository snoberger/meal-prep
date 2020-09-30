import * as uuid from "uuid";
import handler from "../libs/handler-lib";
import dynamoDb from "../libs/dynamodb-lib";
export const main = handler(async (event, context) => {
  let data = JSON.parse(event.body);
  const params = {
    TableName: 'auth',
    Item: {
      userId: uuid.v1(),
      user: data.user,
      pass: data.pass,
      email: data.email,
      createTs: Date.now(),
      updateTs: Date.now()
    }
  };
  await dynamoDb.put(params);
  return params.Item;
});