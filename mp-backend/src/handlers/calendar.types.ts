
import DynamoDB from 'aws-sdk/clients/dynamodb';

export type Timestamp = number;
export type Uuid = string;

export interface CalendarRequestBody extends Record<string, string | number | Date>{
    userId: Uuid,
    date: Date,
    notify: string,
    description: string,
}


export interface CalendarTableEntry extends DynamoDB.DocumentClient.PutItemInputAttributeMap {
    id: Uuid,
    userId: Uuid,
    date: Date,
    notify: string,
    description: string,
    createTs: Timestamp,
    updateTs: Timestamp
  }