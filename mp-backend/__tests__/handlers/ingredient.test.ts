import { expect } from "@jest/globals";
import { Event, createEvent } from  "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { createIngredient, deleteIngredient, getIngredient } from "../../src/handlers/ingredient";


interface LambdaBody {
     message: string
}
describe('createIngredient', () => {
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

    it('should return 201 and success message when putting a new ingredient', async () => {
        event.body = JSON.stringify({'name': 'testIngredient', 'metric': 'testMetric'});
        
        const result = await createIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(201);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("success")
        expect(dynamoDb.put).toBeCalled();
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        const event = {
            body: "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}"
        }

        const result = await createIngredient(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (trailing comma case)', async () => {
        const event = {
            body: '{"username": "singleQuote", "password": "SingleQuote",}'
        }

        const result = await createIngredient(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('should return status code 400 and Malformed event body if the event does not have a body', async () => {
        const result = await createIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: name not specified if the event does not have a name', async () => {
        event.body = JSON.stringify({'metric': 'testMetric'})
        

        const result = await createIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: name not specified")
    });

    it('should return status code 400 and Malformed event body: "Steps not specified if the event does not have a metric field', async () => {
        event.body = JSON.stringify({'name': 'testName'});
        

        const result = await createIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: metric not specified")
    });


    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({'name': 'testName', 'metric': 'testMetric'});
        dynamoDb.put = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await createIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'name': 'testName', 'metric': 'testMetric'});
        event.principalId = undefined;

        const result = await createIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
    

});

describe('getIngredient', () => {
    const ingredientTable = {
        ingredient: {
            'id': '1',
            'name': 'testName',
            'metric': 'testMetric'
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

    it('should return a ingredient based on its ID', async () => {
        event.pathParameters = {'ingredientId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: ingredientTable.ingredient});
        
        const result = await getIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await getIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have id', async () => {
        event.pathParameters = {};

        const result = await getIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
        event.pathParameters = {'ingredientId': '1'};
        dynamoDb.get = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});

        const result = await getIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'ingredientId': '1'};
        event.principalId = undefined;

        const result = await getIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
});

describe('deleteIngredient', () => {
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

    it('should delete a ingredient based on its ID', async () => {
        event.pathParameters = {'ingredientId': '1'};
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({"Attributes": {}});
        
        const result = await deleteIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await deleteIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have ingredientId', async () => {
        event.pathParameters = {};

        const result = await deleteIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.delete fails', async () => {
        event.pathParameters = {'ingredientId': '1'};
        dynamoDb.delete = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});

        const result = await deleteIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'ingredientId': '1'};
        event.principalId = undefined;

        const result = await deleteIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    
    it('should return 404 Ingredient not found if deleting a ingredientId that does not exist', async () => {
        event.pathParameters = {'ingredientId': '1'};
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({"ConsumedCapacity": {}});

        const result = await deleteIngredient(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(404);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Ingredient not found");
    });



});