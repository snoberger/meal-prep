/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from "@jest/globals";
import { create, deleteUser } from "../../src/handlers/user";
import { Event, createEvent } from "../utils/event.handler";
import { authLib } from "../../src/libs/authentication";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';

describe('create user', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env.PEPPER = 'SPICY'
        dynamoDb.put = jest.fn();
        dynamoDb.get = jest.fn();
        dynamoDb.query = jest.fn().mockResolvedValue({ Count: 0 });
    });

    afterAll(() => {
        delete process.env.PEPPER;
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('accepts create requests with an exactly-defined body', async () => {
        const event = {
            body: JSON.stringify({ 'username': 'newuser', 'password': 'newuser' })
        };
        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(201);
        expect(dynamoDb.query).toHaveBeenCalled();
        expect(dynamoDb.put).toHaveBeenCalled();
    });

    it('accepts create requests with a defined body', async () => {
        const event = {
            body: JSON.stringify({ 'extrafield1': 'extra', 'username': 'newuser2', 'password': 'newuser2', 'extrafield2': 'extra' })
        };
        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(201);
        expect(dynamoDb.query).toHaveBeenCalled();
        expect(dynamoDb.put).toHaveBeenCalled();
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        const event = {
            body: "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}"
        }

        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (trailing comma case)', async () => {
        const event = {
            body: '{"username": "singleQuote", "password": "SingleQuote",}'
        }

        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns internal server error on database query failure', async () => {
        const event = {
            body: JSON.stringify({ 'username': 'test', 'password': 'test' })
        };

        dynamoDb.query = jest.fn().mockRejectedValueOnce({ 'error': 'test error' });

        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.query).toHaveBeenCalled();

    });

    it('returns internal server error on database put failure', async () => {
        const event = {
            body: JSON.stringify({ 'username': 'test', 'password': 'test' })
        };
        dynamoDb.put = jest.fn().mockRejectedValueOnce({ 'error': 'testError' });
        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toHaveBeenCalled();
    });

    it('returns internal server error on get user credentials error', async () => {
        const event = {
            body: JSON.stringify({ 'username': 'test', 'password': 'test' })
        };

        authLib.getHashedCredentials = jest.fn().mockRejectedValueOnce({ 'error': 'testError' });
        const hashedCredentialsSpy = jest.spyOn(authLib, 'getHashedCredentials')

        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(hashedCredentialsSpy).toHaveBeenCalled();
    });


    it('declines create request with duplicate username', async () => {
        const event = {
            body: JSON.stringify({ 'username': 'iexist', 'password': 'toobad' })
        };
        dynamoDb.query = jest.fn().mockResolvedValueOnce({
            Count: 1
        });
        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(409);
        expect(dynamoDb.query).toHaveBeenCalled();
    });

    it('declines create requests without a body field', async () => {
        const event = {
            body: ''
        };
        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('declines requests with malformed body', async () => {
        const event = {
            body: JSON.stringify({ 'username': 'hi', 'passWWord': 'wrong' })
        };
        const result = await create(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });
});


describe('delete user', () => {
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.delete = jest.fn();
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('accepts delete requests with an exactly-defined body', async () => {
        event = {
            principalId: "1234",
            pathParameters: {'userId': '1234'}
        };

        dynamoDb.delete = jest.fn().mockResolvedValueOnce({
            Attributes: [],
            ConsumedCapacity: 0,
            ItemCollectionMetrics: []
        });

        const result = await deleteUser(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.delete).toHaveBeenCalled();
    });

    it('declines delete requests with an exactly-defined body, but database fails', async () => {
        event = {
            principalId: "1234",
            pathParameters: {'userId': '1234'}
        };

        dynamoDb.delete = jest.fn().mockRejectedValueOnce({ 'error': 'testError' })

        const result = await deleteUser(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(404);
        expect(dynamoDb.delete).toHaveBeenCalled();
    });

    it('declines requests with undefined principle id', async () => {
        event = {
            principalId: "1234",
            pathParameters: {
                userId: "1234",
            }
        };
        event.principalId = undefined
        const result = await deleteUser(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
    });
});

