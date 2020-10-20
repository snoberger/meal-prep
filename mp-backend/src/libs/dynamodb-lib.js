import AWS from "aws-sdk";
let client;
const CONFIG_DYNAMODB_ENDPOINT = process.env.CONFIG_DYNAMODB_ENDPOINT;
const IS_OFFLINE = process.env.IS_OFFLINE;
if (IS_OFFLINE === 'true') {
    client = new AWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: CONFIG_DYNAMODB_ENDPOINT,
    });
  } else {
    client = new AWS.DynamoDB.DocumentClient();
  }
export default {
 get : (params) => client.get(params).promise(),
 put : (params) => client.put(params).promise(),
 query : (params) => client.query(params).promise(),
 update: (params) => client.update(params).promise(),
 delete: (params) => client.delete(params).promise(),
 scan: (params) => client.scan(params).promise(),
};