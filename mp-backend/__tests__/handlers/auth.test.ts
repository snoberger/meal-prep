/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from "@jest/globals";
import { authenticate } from  "../../src/handlers/auth";
import { createEvent } from  "../utils/event.handler";
import { create } from '../../src/handlers/user'
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { authLib } from "../../src/libs/authentication";

describe('authentication endpoint', () => {

    const userTable = {
        user: {
            'userId': '1',
            'username': 'iexist',
            'salt': 'ilikesalt',
            'userpass': 'hashedresult'
        }
    };

    beforeEach(async () => {
        jest.resetModules();
        process.env.PEPPER = 'SPICY';

        dynamoDb.put = jest.fn();
        dynamoDb.get = jest.fn();
        dynamoDb.query = jest.fn();
        authLib.getHashedCredentials = jest.fn();

        const createUser = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }
        await create(createEvent(createUser), Context(), () => {return});

    });

    afterAll(() => {
        delete process.env.PEPPER;
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('accept requests with a valid username and password', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }
        dynamoDb.query = jest.fn().mockResolvedValueOnce({Count: 1, Items: [{'userId': '1'}]});
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: userTable.user});
        authLib.getHashedCredentials = jest.fn().mockResolvedValueOnce('hashedresult');

        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
        expect(authLib.getHashedCredentials).toBeCalled();
    });

    it('fails with an invalid username password combination', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }
        dynamoDb.query = jest.fn().mockResolvedValueOnce({Count: 1, Items: [{'userId': '1'}]});
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: userTable.user});
        authLib.getHashedCredentials = jest.fn().mockResolvedValueOnce('invalidHash');

        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(401);
        expect(dynamoDb.get).toBeCalled();
        expect(authLib.getHashedCredentials).toBeCalled();
    });

    it('returns internal server error if looking up id from username fails', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockRejectedValue({'error': 'testError'});
        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });

    it('returns internal server error if looking up id returns multiple users', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockResolvedValue({Count: 3, Items: []});
        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });

    it('returns internal server error if looking up id returns malformed data', async() => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockResolvedValue({Count: 1, Items: [{'foo': 'bar'}]});
        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });

    it('returns user not found if there is no user corresponding to a username', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockResolvedValue({Count: 0, Items: []});
        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(401);
        expect(dynamoDb.query).toBeCalled();
    });

    it('returns internal server error if gettingUserpassAndSalt fails', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockResolvedValueOnce({Count: 1, Items: [{'userId': '1'}]});
        dynamoDb.get = jest.fn().mockRejectedValueOnce({'error': 'testError'});

        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });

    it('returns internal server error if gettingUserpassAndSalt returns malformed data', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockResolvedValueOnce({Count: 1, Items: [{'userId': '1'}]});
        dynamoDb.get = jest.fn().mockResolvedValueOnce({NoItem: 'NoItemHere!'});

        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });

    it('returns internal server error if getHashedCredentials has an error', async () => {
        const event = {
            body: JSON.stringify({'username': 'iexist', 'password': 'yay'})
        }

        dynamoDb.query = jest.fn().mockResolvedValueOnce({Count: 1, Items: [{'userId': '1'}]});
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: userTable.user});
        authLib.getHashedCredentials = jest.fn().mockRejectedValueOnce({'error': 'testError'});

        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
        expect(authLib.getHashedCredentials).toBeCalled();
    });

    it('declines requests without a body field', async () => {
        const event = {
            body: ''
        }
        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(400);
    });

    it('declines requests with malformed body', async () => {
        const event = {
            body: JSON.stringify({'username': 'hi', 'passWWord': 'wrong'})
        }
        const result = await authenticate(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(400);
    });
});
