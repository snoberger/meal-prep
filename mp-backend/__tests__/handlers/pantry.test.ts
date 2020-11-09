import { expect } from "@jest/globals";
import { Event, createEvent } from "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { getAllPantry, getPantry, createPantry, updatePantry, deletePantry } from "../../src/handlers/pantry";

interface LambdaBody {
    message: string
}

describe('create pantry entry', () => {

    let event: Event;
    beforeEach(() => {
        jest.resetModules();
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
            'ingredientId': '1',
            'quantity': '1'
        });

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(201);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("success")
        expect(dynamoDb.put).toBeCalled();
    });


    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({
            'ingredientId': '1',
            'quantity': '1'
        });
        dynamoDb.put = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({
            'ingredientId': '1',
            'quantity': '1'
        });
        event.pathParameters = { 'userId': '1234'};
        event.principalId = undefined;

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('should return malformed event body and status code 400 if no ingredientId', async () => {
        event.body = JSON.stringify({
            'quantity': '1',
        });
        event.pathParameters = { 'userId': '1234'};

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredient not specified");
    });

    it('should return malformed event body and status code 400 if no quantity', async () => {
        event.body = JSON.stringify({
            'ingredientId': '1',
        });
        event.pathParameters = { 'userId': '1234'};

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Quantity not specified");
    });

    it('should return malformed event body and status code 400 if no path parameters', async () => {
        event.pathParameters = undefined;

        const result = await createPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body");
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
            'userId': '1234',
            'id': '1',
            'ingredientId': '1',
            'quantity': '2 oz'
        }
    };
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.get = jest.fn();
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return a pantry based on its ID', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({ Item: PantryTable.pantry });

        const result = await getPantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
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
        dynamoDb.get = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

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
        event.pathParameters = { 'userId': '1234', 'pantryId': '1', 'quantity': '6 oz' };

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the path parameters does not have userId', async () => {
        event.pathParameters = { 'pantryId': '1', 'quantity': '3'};

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    
    it('should return status code 400 and Malformed event body if the path parameters does not have pantryId', async () => {
        event.pathParameters = { 'userId': '1234', 'quantity': '3'};

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    
    it('should return status code 400 and Malformed event body if the path parameters does not have quantity', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1' };

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.update fails', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1', 'quantity': '3 oz' };
        dynamoDb.update = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'pantryId': '1', 'quantity': '320 cups' };
        event.principalId = undefined;

        const result = await updatePantry(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
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