import { expect } from "@jest/globals";
import {createUser} from  "../../src/handlers/auth";
import {createEvent} from  "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import  Context  from 'aws-lambda-mock-context';

dynamoDb.put = jest.fn()
test('a user is saved correctly', async() => {
    const event = {
        body: `{"userId":"test", "userpass":"testpass"}`
    }
    let result = await createUser(createEvent(event), Context(), ()=>{}) 
    expect(result ? result.statusCode: false).toBe(201)
    expect(dynamoDb.put).toHaveBeenCalledWith({
        Item: expect.objectContaining({
            userId:"test",
            userpass:"testpass",
        }),
        TableName: 'auth'
    });
});

test('request is declined if body not present', async() => {
    const event = {
    }
    let result = await createUser(createEvent(event), Context(), ()=>{}) 
    expect(result ? result.statusCode: false).toBe(404)
});

test('request is declined if body does not contain required fields', async() => {
    const event = {
        body: `{"wrong": "field"}`
    }
    let result = await createUser(createEvent(event), Context(), ()=>{}) 
    expect(result ? result.statusCode: false).toBe(404)
});