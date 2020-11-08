/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from "@jest/globals";
import { Event, createEvent } from  "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe, updateIngredients } from "../../src/handlers/recipe";


interface LambdaBody {
     message: string
}
describe('createRecipe', () => {
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.put = jest.fn();
        dynamoDb.query = jest.fn()
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return 200 and success message when putting a new recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(201);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("success")
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have a body', async () => {
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: "UserId not specified if the event does not have a userId', async () => {
        event.body = JSON.stringify({'steps': [], 'ingredients': []})
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: UserId not specified")
    });

    it('should return status code 400 and Malformed event body: "Steps not specified if the event does not have a steps field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'ingredients': []});
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Steps not specified")
    });

    it('should return status code 400 and Malformed event body: "Ingredients not specified if the event does not have a Ingredients field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': []});
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified")
    });

    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        dynamoDb.put = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        event.principalId = undefined;

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
    
    it('should create ingredient on create recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        // @ts-ignore
        dynamoDb.query = jest.fn((query: any) => {
            return {Items: []}
        })
        await createRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalled()
        expect(dynamoDb.put).toHaveBeenCalledTimes(2)
    });
    it('should attach existing ingredient on create recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        
        // @ts-ignore
        dynamoDb.query = jest.fn((query: any) => {
            return {Items: [{id: 'ingredient1234'}]}
        })
        await createRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalledTimes(1)
        expect(dynamoDb.put).toHaveBeenCalledTimes(1)
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

    it('should return all recipes based on userId', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamoDb.query = jest.fn().mockResolvedValueOnce({Item: [recipeTable.recipe, recipeTable.recipe2]});
        
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(200);
        expect(dynamoDb.query).toBeCalled();
    });
    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {

        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = {'recipeId': '1'};

        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.query fails', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamoDb.query = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'userId': '1234'};
        event.principalId = undefined;

        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
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

    it('should return a recipe based on its ID', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: recipeTable.recipe});
        
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = {'recipeId': '1'};

        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});

        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        event.principalId = undefined;

        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
});


describe('updateRecipe', () => {
    let event: Event;
    beforeEach(() => {
        jest.resetModules();
        dynamoDb.update = jest.fn();
        dynamoDb.query = jest.fn();
        dynamoDb.put = jest.fn();
        event = {
            principalId: "1234",
        };
    });

    afterAll(() => {
        jest.resetAllMocks();
        jest.resetModules();
    });

    it('should return 200 and success message when putting a new recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(200);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have a body', async () => {
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: "UserId not specified if the event does not have a userId', async () => {
        event.body = JSON.stringify({'steps': [], 'ingredients': []})
        

        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: UserId not specified")
    });

    it('should return status code 400 and Malformed event body: "Steps not specified if the event does not have a steps field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'ingredients': []});
        
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Steps not specified")
    });

    it('should return status code 400 and Malformed event body: "Ingredients not specified if the event does not have a Ingredients field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': []});
        

        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified")
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the path parameters does not have userId', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        event.pathParameters = {'recipeId': '1'};

        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.update fails', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.update = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': []});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        event.principalId = undefined;

        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('should update ingredient on update recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        await updateRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalled()
        expect(dynamoDb.put).toHaveBeenCalled()
        expect(dynamoDb.update).toHaveBeenCalled()
    });
    it('should create ingredient on update recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        // @ts-ignore
        dynamoDb.query = jest.fn((query: any) => {
            return {Items: []}
        })
        await updateRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalled()
        expect(dynamoDb.update).toHaveBeenCalledTimes(1)
        expect(dynamoDb.put).toHaveBeenCalledTimes(1)
    });
    it('should attach existing ingredient on update recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        // @ts-ignore
        dynamoDb.query = jest.fn((query: any) => {
            return {Items: [{id: 'ingredient1234'}]}
        })
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.query).toHaveBeenCalledTimes(1)
        expect(dynamoDb.put).toHaveBeenCalledTimes(0)
        expect(dynamoDb.update).toHaveBeenCalledTimes(1)
    });

});

describe('deleteRecipe', () => {
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

    it('should delete a recipe based on its ID', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({"Attributes": {}});
        
        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = {'recipeId': '1'};

        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });
    it('should return status code 400 and Malformed event body if the pathparameters does not have recipeId', async () => {
        event.pathParameters = {'userId': '1234'};

        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.delete fails', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.delete = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});

        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        event.principalId = undefined;

        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    
    it('should return 404 Recipe not found if deleting a recipeId that does not exist', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({"ConsumedCapacity": {}});

        const result = await deleteRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(404);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Recipe not found");
    });



});