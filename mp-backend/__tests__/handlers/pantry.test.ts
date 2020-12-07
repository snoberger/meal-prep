import { expect } from "@jest/globals";
import { Event, createEvent } from "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import * as IngredientHandler from "../../src/handlers/ingredient";
import Context from 'aws-lambda-mock-context';
import { getAllPantry, getPantry, createPantry, updatePantry, deletePantry } from "../../src/handlers/pantry";
import { PantryIngredient, PantryTableEntry } from "../../src/handlers/pantry.types";

interface LambdaBody {
    message: string
}

describe('create pantry entry', () => {

    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        (IngredientHandler ).updateIngredients = jest.fn()
        dynamoDb.put = jest.fn();
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });
    it('should return 200 and success message when creating a new pantry entry', async () => {
        event.body = JSON.stringify({
            "ingredients": [{
                'name': 'test',
                'amount': '1',
                'metric': 'tester'
            }]
        });

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(201);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("success")
        expect(dynamoDb.put).toBeCalled();
    });


    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({
            "ingredients": [{
                'name': 'test',
                'amount': '1',
                'metric': 'tester'
            }]
        });
        dynamoDb.put = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        const event = {
            body: "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}"
        }

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (trailing comma case)', async () => {
        const event = {
            body: '{"username": "singleQuote", "password": "SingleQuote",}'
        }

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({
            "ingredients": [{
                'name': 'test',
                'amount': '1',
                'metric': 'tester'
            }]
        });
        event.pathParameters = { 'userId': '1234'};
        event.principalId = undefined;

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('should return malformed event body and status code 400 if no name', async () => {
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
                'metric': 'cups'
            }]
        });
        event.pathParameters = { 'userId': '1234'};

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed");
    });
    it('should return malformed event body and status code 400 if no metric ', async () => {
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
                'name': 'test'
            }]
        });
        event.pathParameters = { 'userId': '1234'};

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed");
    });

    it('should return malformed event body and status code 400 if no amount', async () => {
        event.body = JSON.stringify({
            "ingredients": [{
                'metric': 'cups',
                'name': 'test'
            }]
        });
        event.pathParameters = { 'userId': '1234'};

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed");
    });
    it('should return malformed event body and status code 400 if no ingredient List', async () => {
        event.body = JSON.stringify({
            "notingredients": [{
                'name': 'test'
            }]
        });
        event.pathParameters = { 'userId': '1234'};

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified");
    });

    it('should return malformed event body and status code 400 if no path parameters', async () => {
        event.pathParameters = undefined;

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body");
    });

    it('should return status code 500 and Internal server error if updateIngredients fails', async () => {
        event.body = JSON.stringify({'userId': '1234', 'ingredients': [{
            name: "testName",
            metric: 'testMetric',
            amount: 1
        }]});

        (IngredientHandler ).updateIngredients = jest.fn(()=> {
            throw 'error'
        })
        const result = await createPantry(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
    });

});

describe('get all pantry entries', () => {
    const pantryTable = {
        pantry: {
            'userId': '1234',
            'id': '1',
            'ingredientId': '1',
            'quantitiy': '2 oz'
        },
        pantry2: {
            'userId': '1234',
            'id': '2',
            'ingredientId': '2',
            'quantity': '4 oz'
        }
    };
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.query = jest.fn();
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return all panntry entires based on userId', async () => {
        event.pathParameters = { 'userId': '1234' };
        dynamoDb.query = jest.fn().mockResolvedValueOnce({ Item: [pantryTable.pantry, pantryTable.pantry2] });

        const result = await getAllPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.query).toBeCalled();
    });


    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {

        const result = await getAllPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = { };

        const result = await getAllPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.query fails', async () => {
        event.pathParameters = { 'userId': '1234' };
        dynamoDb.query = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await getAllPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234' };
        event.principalId = undefined;

        const result = await getAllPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });


});

describe('get pantry', () => {
    const PantryTable = {
        pantry: {
            "ingredients": [
                {
                    "id": "2d314782-26ba-461f-b091-74b39cd628cb",
                    "amount": "4"
                },
                {
                    "id": "1d314782-26ba-461f-b091-74b39cd628cb",
                    "amount": false
                }
            ],
            "createTs": 1604946468481,
            "id": "1",
            "userId": "user",
            "updateTs": 1604946468481
        },
        pantryFail: {
            "ingredients": [],
            "createTs": 1604946468481,
            "id": "2",
            "userId": "user2",
            "updateTs": 1604946468481
        }
    };
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.get = jest.fn();
        event = {
            principalId: "1234",
        };
        dynamoDb.batchGet = jest.fn()
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return a pantry based on its ID', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: PantryTable.pantry });
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: [{
                name: "test",
                metric: 'stuff',
                id: "2d314782-26ba-461f-b091-74b39cd628cb"
            },{
                name: "test",
                metric: 'stuff',
                id: "1d314782-26ba-461f-b091-74b39cd628cb"
            }]
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        const ingredients = result ? (<PantryTableEntry<PantryIngredient>>JSON.parse(result.body)).ingredients : []
        expect(ingredients[0].amount).toBe('4')
        expect(ingredients[0].name).toBe('test')
        expect(dynamoDb.batchGet).toBeCalled();
    });

    it('should return a 500 ', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: PantryTable.pantry });
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: {
                name: "test",
                metric: 'stuff',
                id: "2d314782-26ba-461f-b091-74b39cd628cb"
            }
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Malformed Ingredient in database")
    });

    it('should return a pantry with ingredients from request if ingredient not found from pantry based on its ID', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {
            ...PantryTable.pantry,
            ingredients: []
        } });
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: [{
                name: "test",
                metric: 'stuff',
                id: "2d314782-26ba-461f-b091-74b39cd628cb"
            }]
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        const ingredients = result ? (<PantryTableEntry<PantryIngredient>>JSON.parse(result.body)).ingredients : []
        expect(ingredients.length).toBe(0)
    });
    it('should return error on malformed pantry, pantry empty', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {}});
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: {
                name: "test",
                metric: 'stuff',
                id: "2d314782-26ba-461f-b091-74b39cd628cb"
            }
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Pantry item is malformed:")
    });
    it('should throw error on pantry ingredients undefined', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {
            createTs: PantryTable.pantry.createTs,
            updateTs: PantryTable.pantry.updateTs,
            id: PantryTable.pantry.id,
            userId: PantryTable.pantry.userId
        }});
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: []
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Internal server error")
    });
    it('should return error on malformed pantry request ingredients', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {
            ...PantryTable.pantry,
            ingredients: [
                {}
            ]
        }});
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed")
        expect(dynamoDb.get).toBeCalled();
    });
    it('should return on empty pantry request ingredients', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {
            ...PantryTable.pantry,
            ingredients: []
        }});
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: {}
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });
    it('should return error on malformed pantry request id', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {
            createTs: PantryTable.pantry.createTs,
            updateTs: PantryTable.pantry.updateTs,
            ingredients: PantryTable.pantry.ingredients,
            userId: PantryTable.pantry.userId
        }});
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("id not specified")
        expect(dynamoDb.get).toBeCalled();
    });
    it('should return error on malformed pantry request user id', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: {
            createTs: PantryTable.pantry.createTs,
            updateTs: PantryTable.pantry.updateTs,
            ingredients: PantryTable.pantry.ingredients,
            id: PantryTable.pantry.id
        }});
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("userId not specified")
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return error on malformed pantry ingredients', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: PantryTable.pantry});
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ Responses:{
            ingredient: [{
                id: "2d314782-26ba-461f-b091-74b39cd628cb"
            }]
        } });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed Ingredient in database")
        expect(dynamoDb.batchGet).toBeCalled();
    });

    it('should return nothing if no elements in get', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({});
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({ 
            Responses:{
                ingredient: []
            } 
        });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should respond with empty ingredients if no elements in batchGet', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: PantryTable.pantryFail });
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({Responses:{
            ingredient: []
        }  });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return a 500 if batchGet fails', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: PantryTable.pantry });
        dynamoDb.batchGet = jest.fn().mockImplementation(()=> {
            throw 'error'
        });
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = { 'pantryId': '1' };

        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockRejectedValueOnce(()=> {throw 'error'});

        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        event.principalId = undefined;

        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
});


describe('update pantry entry', () => {
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.update = jest.fn();
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return 200 and success message when putting a new pantry', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
                'id': 'testId'
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if an ingredientslist item is missing id', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed")
    });

    it('should return status code 200 if an ingredientslist is empty', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": []
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
    });
    it('should return status code 400 and Malformed event body if an ingredientslist is undefined', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": undefined
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified")
    });
    it('should return status code 400 and Malformed event body if an ingredientslist without id is missing metric ', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
                'name': 'test'
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed")
    });
    it('should return status code 400 and Malformed event body if an ingredientslist without id is missing amount ', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": [{
                'metric': 'cups',
                'name': 'test'
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed")
    });

    it('should return status code 400 and Malformed event body if an ingredientslist without id is missing name ', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
                'metric': 'cups'
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed")
    });
    
    it('should return status code 400 and Malformed event body if an ingredientslist item is missing amount', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "ingredients": [{
                'id': 'testId',
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient in body malformed")
    });

    
    it('should return status code 400 and Malformed event body if an ingredientslist is malformed', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = JSON.stringify({
            "notIngredients": [{
                'id': 'testId',
            }]
        });
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified")
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        event.body = "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}";
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('returns malformed data error when a user passes in no body', async () => {
        event.pathParameters = { 'pantryId': '1', 'userId':'1234'};
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.update fails', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1'};
        event.body = JSON.stringify({
            "ingredients": [{
                'amount': '1',
                'id': 'testId'
            }]
        });
        dynamoDb.update = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1'};
        event.principalId = undefined;

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('should create ingredient on update pantry', async () => {
        event.body = JSON.stringify({'userId': '1234', 'ingredients': [{
            name: "testName",
            metric: 'testMetric',
            amount: 1
        }]});
        event.pathParameters = {'userId': '1234', 'pantryId': '1'};

        (IngredientHandler ).updateIngredients = jest.fn()
        const result = await updatePantry(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect((IngredientHandler ).updateIngredients).toHaveBeenCalled()
        expect(dynamoDb.update).toHaveBeenCalledTimes(1)
    });

    it('should return status code 500 and Internal server error if updateIngredients fails', async () => {
        event.body = JSON.stringify({'userId': '1234', 'ingredients': [{
            name: "testName",
            metric: 'testMetric',
            amount: 1
        }]});
        event.pathParameters = {'userId': '1234', 'pantryId': '1'};

        (IngredientHandler ).updateIngredients = jest.fn(()=> {
            throw 'error'
        })
        const result = await updatePantry(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
    });

});

describe('delete pantry entry', () => {
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.delete = jest.fn();
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should delete a pantry based on its ID', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({ "Attributes": {} });

        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = { 'pantryId': '1' };

        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });
    it('should return status code 400 and Malformed event body if the pathparameters does not have pantryId', async () => {
        event.pathParameters = { 'userId': '1234' };

        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.delete fails', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.delete = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        event.principalId = undefined;

        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });


    it('should return 404 pantry not found if deleting a pantryId that does not exist', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({ "ConsumedCapacity": {} });

        const result = await deletePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(404);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Pantry not found");
    });
});