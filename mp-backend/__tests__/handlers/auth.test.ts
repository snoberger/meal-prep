import { expect } from "@jest/globals";
import {createUser} from  "../../src/handlers/auth.js";
import dynamoDb from "../../src/libs/dynamodb-lib";

dynamoDb.put = jest.fn()
test('a user is saved', async() => {
    expect((await createUser({body: `{"userId":"1","userpass":"test"}`})).statusCode).toBe(201);
    expect(dynamoDb.put).toHaveBeenCalledWith({
        Item: expect.objectContaining({
            userId:"1",
            userpass:"test",
        }),
        TableName: 'auth'
    });
});