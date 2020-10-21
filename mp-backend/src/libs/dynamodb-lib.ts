/* eslint-disable */
import { AWSError } from "aws-sdk";
import  DynamoDB, { GetItemInput, PutItemInput, QueryInput, UpdateItemInput, DeleteItemInput, 
        ScanInput, GetItemOutput, PutItemOutput, QueryOutput, UpdateItemOutput, 
        ScanOutput, DeleteItemOutput } from "aws-sdk/clients/dynamodb";
import { PromiseResult } from "aws-sdk/lib/request";
/* eslint-enable */


export class DynamoDBLib {
  client: DynamoDB.DocumentClient;
  
  constructor() {
      const CONFIG_DYNAMODB_ENDPOINT = process.env.CONFIG_DYNAMODB_ENDPOINT;
      const IS_OFFLINE = process.env.IS_OFFLINE;
      if (IS_OFFLINE === 'true') {
          this.client = new DynamoDB.DocumentClient({
              region: 'localhost',
              endpoint: CONFIG_DYNAMODB_ENDPOINT,
          });
      } else {
          this.client = new DynamoDB.DocumentClient();
      }
  }

  get = (params: GetItemInput): Promise<PromiseResult<GetItemOutput, AWSError>> => this.client.get(params).promise();
  put =  (params: PutItemInput): Promise<PromiseResult<PutItemOutput, AWSError>> => this.client.put(params).promise();
  query = (params: QueryInput): Promise<PromiseResult<QueryOutput, AWSError>> => this.client.query(params).promise();
  update = (params: UpdateItemInput): Promise<PromiseResult<UpdateItemOutput, AWSError>> => this.client.update(params).promise();
  delete = (params: DeleteItemInput): Promise<PromiseResult<DeleteItemOutput, AWSError>> => this.client.delete(params).promise();
  scan = (params: ScanInput): Promise<PromiseResult<ScanOutput, AWSError>> => this.client.scan(params).promise();

}

export default new DynamoDBLib();
