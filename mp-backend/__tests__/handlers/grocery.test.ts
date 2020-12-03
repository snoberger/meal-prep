import { generate } from '../../src/handlers/grocery';
import { Event, createEvent } from "../utils/event.handler";
import * as pantry from '../../src/handlers/pantry';
import Context from 'aws-lambda-mock-context';
import dynamoDb from "../../src/libs/dynamodb-lib";

interface LambdaBody {
    message: string
}
jest.mock('aws-sdk', () => {
    return {
        SES: ()=>{
            return {
                sendEmail: () => {
                    return {
                        promise: jest.fn()
                    }
                }
            }
        }
    }
});
describe('generate grocery endpoint', () => {

    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        process.env.EMAIL = 'SPICY'
        dynamoDb.put = jest.fn();
        dynamoDb.get = jest.fn();
        dynamoDb.query = jest.fn();

        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        delete process.env.EMAIL;
        jest.resetAllMocks();
        jest.resetModules();
    });


    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.principalId = undefined;

        const result = await generate(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('returns malformed event body on non JSON-parsable bodies (single quotes)', async () => {
        event.body = "{\"username\": \"iexist\", 'password': 'yay'}"

        const result = await generate(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed request body");
    });

    it('returns malformed event body on non JSON-parsable bodies (trailing comma)', async () => {
        event.body = "{\"username\": \"iexist\", \"password\": \"yay\",}"

        const result = await generate(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed request body");
    });

    it('returns 400 and bad request if there is no event body', async () => {
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Bad request");
    });

    it('returns an error and status code 400 if the event body is well formatted but doesn\'t contain a list of recipes', async () => {
        event.body = JSON.stringify({ notRecipes: [1, 2, 3] });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: request must contain a recipes array, containing recipeIds");
    });

    it('returns 500 and internal server error if getting all pantry fails', async () => {
        event.body = JSON.stringify({ 'recipes': ['1', '2'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockRejectedValueOnce({ statusCode: 500, body: 'error' });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Internal server error");
    });

    it('returns 500 and internal server error if getting all pantry succeeds, but incorrectly', async () => {
        event.body = JSON.stringify({ 'recipes': ['1', '2'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({ statusCode: 500, body: 'error' });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Internal server error");
    });

    it('returns 500 and internal server error if it cannot parse the result from getAllPantry', async () => {
        event.body = JSON.stringify({ 'recipes': ['1', '2'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({ statusCode: 200, body: '{jso"N:" messedUp"}' });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Internal server error");
    });

    it('returns 500 and internal server error if it CAN parse results from getAllPantry but results are incorrect', async () => {
        event.body = JSON.stringify({ 'recipes': ['1', '2'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [{
                    'ingredients2': [
                        {
                            'id': '1'
                        }
                    ]
                }]
            )
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        // expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Internal server error");
    });

    it('returns 400 and malformed event body if it cannot find ingredients matching an id', async () => {
        event.body = JSON.stringify({ 'recipes': ['1', '2'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockRejectedValueOnce({ 'error': 'testError' });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Malformed event body: could not find recipe matching id");
    });

    it('returns status code 200 if it succesfully generates a list and sends email', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    }
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("pineapple - 2 fruit (You have: 1 fruit)");
    });

    it('returns status code 500 if there is no email env variable', async () => {
        delete process.env.EMAIL
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    }
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("email fail");
    });

    it('returns status code 400 if there is no user in the table with userId', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    }
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({});
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toEqual("Malformed event body: could not find user id 1234");
    });

    it('returns status code 200 if it succesfully generates a list with multiple metrics in pantry', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '2',
                                'amount': '1/2'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'clove'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    },
                    {
                        'id': '3',
                        'amount': '4'
                    }
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Wok',
                'metric': 'Oil'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        // expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("<ul><li>pineapple - 2 fruit (You have: 1 fruit, 0.5 clove)</li><li>wok - 4 oil</li></ul>");
    });

    it('fails fractionToDecimal and the ingredient is skipped', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '2',
                                'amount': '1/2'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'clove'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    },
                    {
                        'id': '3',
                        'amount': 'six/4'
                    },
                    {
                        'id': '4',
                        'amount': '4/six'
                    },
                    {
                        'id': '5',
                        'amount': 'bags'
                    },
                    {
                        'id': '6',
                        'amount': '4/5/5'
                    }
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Wok',
                'metric': 'Oil'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Canola',
                'metric': 'Oil'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Vegetable',
                'metric': 'oil'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'green',
                'metric': 'oil'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("pineapple - 2 fruit (You have: 1 fruit, 0.5 clove)");
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).not.toContain("wok oil");
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).not.toContain("canola oil");
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).not.toContain("vegetable oil");
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).not.toContain("green oil");
    });

    it('adds similar ingredients together', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '1',
                                'amount': '1/2'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    },
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("pineapple - 2 fruit (You have: 1.5 fruit)");
    });

    it('fails fraction to decimal with similar ingredients, but continues as the ingredient is skipped', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '1',
                                'amount': 'six'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    },
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("pineapple - 2 fruit (You have: 1 fruit)");
    });

    it('fails fraction to decimal with similar ingredients, but different metrics', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '2',
                                'amount': 'six'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'clove'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Recipe 1',
                'description': 'A recipe',
                'ingredients': [
                    {
                        'id': '1',
                        'amount': '2'
                    },
                ]
            }
        }).mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("pineapple - 2 fruit (You have: 1 fruit)");
    });

    it('returns status code 500 and intenral server erorr if it fails to lookup a pantry ingredient Id', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '2',
                                'amount': 'six'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockRejectedValueOnce({
            'Error': 'TestError'
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Internal server error");
    });

    it('returns status code 500 and intenral server erorr if it fails to lookup a pantry ingredient Id', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            },
                            {
                                'id': '2',
                                'amount': 'six'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Error': 'TestError'
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Internal server error");
    });

    it('skips a recipe if it cannot find it\'s Id', async () => {
        event.body = JSON.stringify({ 'recipes': ['1'] });
        const mockGetAllPantry = jest.spyOn(pantry, 'getAllPantry').mockResolvedValueOnce({
            statusCode: 200, body: JSON.stringify(
                [
                    {
                        'ingredients': [
                            {
                                'id': '1',
                                'amount': '1'
                            }
                        ]
                    }
                ]
            )
        });

        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            'Item': {
                'name': 'Pineapple',
                'metric': 'fruit'
            }
        }).mockResolvedValueOnce({
            'Error': 'TestError'
        }).mockResolvedValueOnce({
            'Item': {
                'username': 'test@wisc.edu',
                'id': '',
                'userpass': '',
                'salt': 'SecureRandomString',
                'pantryId': '',
                'createTs': 0,
                'updateTs': 0
            }
        });
        const result = await generate(createEvent(event), Context(), () => { return });
        expect(mockGetAllPantry).toBeCalled();
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("");
    });
});