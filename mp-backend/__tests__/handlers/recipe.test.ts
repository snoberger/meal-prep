/* eslint-disable @typescript-eslint/no-unsafe-call */
import { expect } from "@jest/globals";
import { Event, createEvent } from  "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { getAllRecipes, getRecipe, createRecipe, updateRecipe, deleteRecipe } from "../../src/handlers/recipe";
import dynamodbLib from "../../src/libs/dynamodb-lib";
import { RecipeIngredient, RecipeTableEntry, RecipiesResponseBody } from "../../src/handlers/recipe.types";


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

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        const event = {
            body: "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}"
        }

        const result = await createRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (trailing comma case)', async () => {
        const event = {
            body: '{"username": "singleQuote", "password": "SingleQuote",}'
        }

        const result = await createRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('should return 200 and success message when putting a new recipe', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': []});
        
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

    it('should return status code 400 and Malformed event body: "Steps not specified if the event does not have a steps field', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'ingredients': []});
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Steps not specified")
    });

    it('should return status code 400 and Malformed event body: "Ingredients not specified if the event does not have a Ingredients field', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': []});
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Ingredients not specified")
    });
    it('should return status code 400 and Malformed event body: "name not specified if the event does not have a name field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'description': 'desc', 'steps': [],  'ingredients': []});
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Name not specified")
    });
    it('should return status code 400 and Malformed event body: "Description not specified if the event does not have a steps field', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test',  'steps': [], 'ingredients': []});
        

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Description not specified")
    });

    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': []});
        dynamoDb.put = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': []});
        event.principalId = undefined;

        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
    
    it('should create ingredient on create recipe', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        dynamoDb.query = jest.fn().mockResolvedValueOnce({
            Items: []
        })
        await createRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalled()
        expect(dynamoDb.put).toHaveBeenCalledTimes(2)
    });
    it('should attach existing ingredient on create recipe', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        
        dynamoDb.query = jest.fn().mockResolvedValueOnce({
            Items: [{id: 'ingredient1234'}]
        })
        await createRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalledTimes(1)
        expect(dynamoDb.put).toHaveBeenCalledTimes(1)
    });
    
    it('should succeed on empty ingredient', async () => {
        event.body = JSON.stringify({
            'userId': '1234',
            'name': 'test', 
            'description': 'desc',
            'steps': [], 
            'ingredients': [{
            }]
        });
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");

    });
    it('should suceed on empty ingredients', async () => {
        event.body = JSON.stringify({
            'userId': '1234',
            'name': 'test', 
            'description': 'desc',
            'steps': [], 
            'ingredients': {}
        });
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(201);
    });
    it('should throw error on create ingredient error on create recipe', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        
        dynamoDb.query = jest.fn().mockResolvedValueOnce({
            Items: []
        })
        dynamoDb.put = jest.fn().mockRejectedValueOnce({ 'error': 'testError' });
        const result = await createRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
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
    
    it('should return error on missing id', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamodbLib.query = jest.fn().mockResolvedValueOnce({Items: [
            {
                name: 'testName',
                description: 'testDesc'
            }
        ]});
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Id not specified");
    });
    it('should return error on missing name', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamodbLib.query = jest.fn().mockResolvedValueOnce({Items: [
            {
                id: 'recipeId1',
                description: 'testDesc'
            }
        ]});
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Name not specified");
    });
    it('should return error on missing description', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamodbLib.query = jest.fn().mockResolvedValueOnce({Items: [
            {
                id: 'recipeId1',
                name: 'testName',
            }
        ]});
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Description not specified");
    });
    it('should throw error on no list', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamodbLib.query = jest.fn().mockResolvedValueOnce({Items: {}});
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Internal server error");
  
    });
    it('should return', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamodbLib.query = jest.fn().mockResolvedValueOnce({Items: [
            {
                id: 'recipeId1',
                name: 'testName',
                description: 'description'
            }
        ]});
        const result = await getAllRecipes(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        const recipies = result ? (<RecipiesResponseBody[]>JSON.parse(result.body)) : [];
        expect(recipies[0].id).toBe('recipeId1')
        expect(recipies[0].name).toBe('testName')
        expect(recipies[0].description).toBe('description')
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
        
        dynamodbLib.batchGet = jest.fn().mockResolvedValueOnce({Responses: {
            ingredient: []
        }})
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
    it('should return status code 500 and Malformed event body if userId is missing', async () => {
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            Item: {
                steps: [],
                ingredients:[],
                id: 'id'
            }
        })
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("userId not specified")
    });
    it('should return status code 500 and Internal Server Error on empty get response', async () => {
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({})
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Internal server error")
    });
    it('should return status code 400 and Ingredient in body malformed ingredient empty', async () => {
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            Item: {
                steps: [],
                id: 'id',
                userId:'userId'
            }
        })
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({
            Responses: []
        })
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredients not specified")
    });
    it('should return status code 400 and Ingredients is not an array on ingredient empty', async () => {
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            Item: {
                steps: [],
                id: 'id',
                ingredients: {},
                userId:'userId'
            }
        })
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({
            Responses: []
        })
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredients is not an array")
    });
    it('should set amount if ingredient was not found', async () => {
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            Item: {
                steps: [],
                id: 'id',
                ingredients: [{
                    id: 'ing2',
                    amount: 0
                }],
                userId:'userId'
            }
        })
        dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({
            Responses: {
                ingredient: [
                    {
                        id: 'ing1',
                        name: 'testName',
                        metric: 'testMetric'
                    }
                ]
            }
        })
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
    });
    it('should return status code 500 and Malformed event body if id is missing', async () => {
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({
            Item: {
                steps: [],
                ingredients:[],
                userId: 'userId'
            }
        })
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("id not specified")
    });
    it('should throw error on malformed ingredient', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                        id: "ing1",
                        name:'testName',
                    }
                ]
            }
        })
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    });
    it('should throw error on malformed database ingredient', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                        id: "ing1",
                        amount: 1
                    }
                ]
            }
        })
        dynamodbLib.batchGet = jest.fn().mockResolvedValueOnce({Responses: {
            ingredient: [{
                id: 'ing1',
                name: 'testName',
            }]
        }})
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Malformed Ingredient in database");
    });
    it('should successfully get batch ingredients', async () => {
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                        id: "ing1",
                        amount: 1
                    }
                ]
            }
        })
        dynamodbLib.batchGet = jest.fn().mockResolvedValueOnce({Responses: {
            ingredient: [{
                id: 'ing1',
                name: 'testName',
                metric: 'testMetric'
            }]
        }})
        const result = await getRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        const recipe = result ? (<RecipeTableEntry<RecipeIngredient>>JSON.parse(result.body)) : undefined
        const ingredients = recipe?.ingredients || []
        expect(ingredients[0].amount).toBe(1)
        expect(ingredients[0].name).toBe('testName')
    });
    it('should return Ingredient in body malformed on missing amount recipe get', async () => {
        event.pathParameters = { 'userId': '1234', 'recipeId': '1' };
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                        id: "ing1",
                    }
                ]
            }
        })

        const result = await getRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.batchGet).toBeCalled(); 
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    
    });
    it('should return Ingredient in body malformed on missing id recipe get', async () => {
        event.pathParameters = { 'userId': '1234', 'recipeId': '1' };
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                        amount: 1,
                    }
                ]
            }
        })

        const result = await getRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.batchGet).toBeCalled(); 
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    
    });
    it('should return Ingredient in body malformed on empty ingredient', async () => {
        event.pathParameters = { 'userId': '1234', 'recipeId': '1' };
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                    }
                ]
            }
        })

        const result = await getRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.batchGet).toBeCalled(); 
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    
    });
    it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
        event.pathParameters = { 'userId': '1234', 'recipeId': '1' };
        dynamodbLib.get = jest.fn().mockResolvedValueOnce({
            Item: {
                ...recipeTable.recipe,
                ingredients: [
                    {
                        id: "ing1",
                        amount: 1
                    }
                ]
            }
        })
        dynamoDb.batchGet = jest.fn().mockRejectedValueOnce(()=> {throw 'error'});

        const result = await getRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.batchGet).toBeCalled();
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
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc', 'steps': [], 'ingredients': []});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(200);
        expect(dynamoDb.update).toBeCalled();
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        const event = {
            body: "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}"
        }

        const result = await updateRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (trailing comma case)', async () => {
        const event = {
            body: '{"username": "singleQuote", "password": "SingleQuote",}'
        }

        const result = await updateRecipe(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('should return status code 400 and Malformed event body if the event does not have a body', async () => {
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: "Steps not specified if the event does not have a steps field', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'ingredients': []});
        
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Steps not specified")
    });

    it('should return status code 400 and Malformed event body: "Ingredients not specified if the event does not have a Ingredients field', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': []});
        

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
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': []});
        event.pathParameters = {'recipeId': '1'};

        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.update fails', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': []});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        dynamoDb.update = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'userId': '1234', 'name': 'test', 'description': 'desc',  'steps': [], 'ingredients': []});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};
        event.principalId = undefined;

        const result = await updateRecipe(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('should update ingredient on update recipe', async () => {
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': [{
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
        event.body = JSON.stringify({'userId': '1234','name': 'test', 'description': 'desc',  'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};

        dynamoDb.query = jest.fn().mockResolvedValueOnce({
            Items: []
        })
        await updateRecipe(createEvent(event), Context(), () => {return});
        expect(dynamoDb.query).toHaveBeenCalled()
        expect(dynamoDb.update).toHaveBeenCalledTimes(1)
        expect(dynamoDb.put).toHaveBeenCalledTimes(1)
    });
    it('should attach existing ingredient on update recipe', async () => {
        event.body = JSON.stringify({'userId': '1234', 'name': 'test', 'description': 'desc', 'steps': [], 'ingredients': [{
            name: "testName",
            id: 'ingredient1234',
            metric: 'testMetric',
            amount: 1
        }]});
        
        event.pathParameters = {'userId': '1234', 'recipeId': '1'};

        dynamoDb.query = jest.fn().mockResolvedValueOnce({
            Items: [{id: 'ingredient1234'}]
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