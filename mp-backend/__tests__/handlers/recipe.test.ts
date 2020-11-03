/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from "@jest/globals";
import { createEvent } from  "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { getAllRecipes, getRecipe, createRecipe } from "../../src/handlers/recipe";

interface LambdaBody {
     message: string
}
describe('createRecipe', () => {
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.put = jest.fn();
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return 200 and success message when putting a new recipe', async () => {
        const event = {
            body: JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []})
        };
        
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(201);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("success")
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have a body', async () => {
        const event = {};

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: "UserId not specified if the event does not have a userId', async () => {
        const event = {
            body: JSON.stringify({'steps': [], 'ingredients': []})
        };
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: UserId not specified")
    });

    it('should return status code 400 and Malformed event body: "Steps not specified if the event does not have a steps field', async () => {
        const event = {
            body: JSON.stringify({'userId': '1234', 'ingredients': []})
        };
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Steps not specified")
    });

    it('should return status code 400 and Malformed event body: "Ingredients not specified if the event does not have a Ingredients field', async () => {
        const event = {
            body: JSON.stringify({'userId': '1234', 'steps': []})
        };
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified")
    });

    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        const event = {
            body: JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []})
        };
        dynamoDb.put = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });



});

describe('getAllRecipes', () => {
    const recipeTable = {
        recipe: {
            'userId': '1234',
            'id': '1',
            'steps': [],
            'ingredients': []

        },
        recipe2: {
            'userId': '1234',
            'id': '2',
            'steps': [],
            'ingredients': []

        }
    };
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.query = jest.fn();
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return all recipes based on userId', async () => {
        const event = {
            pathParameters: {'userId': '1234'}
        };
        dynamoDb.query = jest.fn().mockResolvedValueOnce({Item: [recipeTable.recipe, recipeTable.recipe2]});
        
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(200);
        expect(dynamoDb.query).toBeCalled();
    });
    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const event = {};

        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the event does not have userId', async () => {
        const event = {
            pathParameters: {'recipeId': '1'}
        }
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.query fails', async () => {
        const event = {
            pathParameters: {'userId': '1234'}
        };
        dynamoDb.query = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });


});

describe('getRecipe', () => {
    const recipeTable = {
        recipe: {
            'userId': '1234',
            'id': '1',
            'steps': [],
            'ingredients': []

        }
    };
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.get = jest.fn();
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return a recipe based on its ID', async () => {
        const event = {
            pathParameters: {'userId': '1234', 'recipeId': '1'}
        };
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: recipeTable.recipe});
        

        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const event = {};
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the event does not have userId', async () => {
        const event = {
            pathParameters: {'recipeId': '1'}
        }
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
        const event = {
            pathParameters: {'userId': '1234', 'recipeId': '1'}
        }
        dynamoDb.get = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        

        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });
})

