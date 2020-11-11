import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { v4 as uuidv4 } from 'uuid';
import { getPrincipleId } from '../middleware/validation';
import { IngredientTableEntry, isIngredientResponse, updateIngredients } from './ingredient';
import {  RecipeIngredient, RecipeIngredientData, RecipeRequestBody, RecipeTableEntry, RecipiesResponseBody } from './recipe.types'
import { OptionalRequestBody } from './pantry.types';


function determineRecipeRequestBodyFields(data: Record<string, unknown>): string  {
    const ingredients: Array<OptionalRequestBody> = (data.ingredients as Array<OptionalRequestBody>)
    if(!('userId' in data)) {
        return "UserId not specified";
    }
    if(!('ingredients' in data)) {
        return "Ingredients not specified";
    }
    if(ingredients && Array.isArray(ingredients)){
        for( const ingredient of ingredients) {
            if(!ingredient || !Object.keys(ingredient).includes('amount')
                || !Object.keys(ingredient).includes('name') 
                || !Object.keys(ingredient).includes('metric')) {
                return "Ingredient in body malformed";
            }
        }
    }
    if(!('steps' in data)) {
        return "Steps not specified";
    }
    if(!('name' in data)) {
        return "Name not specified";
    }
    if(!('description' in data)) {
        return "Description not specified";
    }
    return "";
}
function isRecipeRequestBody(data: Record<string, unknown>): data is RecipeRequestBody {
    return !determineRecipeRequestBodyFields(data);
}
function determineRecipiesResponseBodyFields(data: Record<string, unknown>[]): string  {
    if(data && Array.isArray(data)) {
        for(const recipe of data) {

            if(!('id' in recipe)) {
                return "Id not specified";
            }
            if(!('name' in recipe)) {
                return "Name not specified";
            }
            if(!('description' in recipe)) {
                return "Description not specified";
            }
        }
    }
    return "";
}
function isRecipiesResponseBody(data: Record<string, unknown>[]): data is RecipiesResponseBody[] {
    return !determineRecipiesResponseBodyFields(data);
}
function determineRecipeResponseFields(data: Record<string, unknown>): string  {
    const ingredients: Array<OptionalRequestBody> = (data.ingredients as Array<OptionalRequestBody>)
    if(!("id" in data)) {
        return "id not specified";
    }
    if(!("userId" in data)) {
        return "userId not specified"
    }
    
    if(!("ingredients" in data)) {
        return "Ingredients not specified"
    }
    if(Array.isArray(ingredients)){
        for( const ingredient of ingredients) {
            if(!ingredient || !Object.keys(ingredient).includes('amount')
                || !Object.keys(ingredient).includes('id')) {
                return "Ingredient in body malformed";
            }
        }
    }
    else {
        return "Ingredients is not an array"
    }
    
    return "";
}
function isRecipeResponseBody(data: Record<string, unknown>): data is RecipeTableEntry<RecipeIngredientData> {
    return !determineRecipeResponseFields(data);
}

export const createRecipe: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        try {
            data = JSON.parse(event.body) as Record<string, unknown>;
        } catch (e) {
            return {
                // TODO: correct status code
                statusCode: 400,
                body: JSON.stringify({message: 'Malformed event body'})
            }
        }
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }

    if(!isRecipeRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determineRecipeRequestBodyFields(data)}`})
        }
    }


    const recipeRequest: RecipeRequestBody = data;

    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    try {
        const ingredients = await updateIngredients(data.ingredients)
        
        const newRecipe: RecipeTableEntry = {
            'id': uuidv4(),
            'userId': userId,
            'name': recipeRequest.name,
            'description':recipeRequest.description,
            'steps': recipeRequest.steps,
            'ingredients': ingredients,
            'createTs': Date.now(),
            'updateTs': Date.now()
        }
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'recipe',
            Item: newRecipe,
        }

        await dynamoLib.put(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }

    return {
        statusCode: 201,
        body: JSON.stringify({ message: 'success' }),
    };
};

export const getAllRecipes: APIGatewayProxyHandler = async (event) => {
    if(!event || !event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const params: DynamoDB.DocumentClient.QueryInput = {
        TableName: 'recipe',
        KeyConditionExpression: '#userId = :userId',
        ExpressionAttributeNames: {
            '#userId': 'userId'
        },
        ExpressionAttributeValues: {
            ':userId': userId
        }
    };
    const data: RecipiesResponseBody[] = [];
    try {
        const response = await dynamoLib.query(params);
        const items = response.Items || []
        if(!isRecipiesResponseBody(items)) {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Recipe in database is invalid: ' + determineRecipiesResponseBodyFields(items)})
            }
        }
        items.forEach((item: RecipiesResponseBody) => {
            data.push({
                name: item.name,
                description: item.description,
                id: item.id
            })
        })
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    return {statusCode: 200, body: JSON.stringify(data)};
}

export const getRecipe: APIGatewayProxyHandler = async (event) => {
    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.recipeId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const pathParameters = event.pathParameters;
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const recipeId = pathParameters.recipeId;

    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'recipe',
        Key: {
            'userId': userId,
            'id': recipeId
        }
    };
    let recipeItem: RecipeTableEntry<RecipeIngredientData> | undefined = undefined;
    
    let outputRecipe: RecipeTableEntry<RecipeIngredient> | undefined = undefined;
    try {
        const resp = await dynamoLib.get(params);
        if(resp.Item) {
            if(!isRecipeResponseBody(resp.Item)) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: 'Recipe item is malformed: ' + determineRecipeResponseFields(resp.Item)})}
            }
            recipeItem = resp.Item
        }
        else {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Internal server error 2'})
            }
        }
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error 2'})
        }
    }
    const ingredients = recipeItem.ingredients
    let ingredientData: IngredientTableEntry[] = []
    try {
        const params: DynamoDB.DocumentClient.BatchGetItemInput = {
            RequestItems:  {
                "ingredient": {
                    Keys: ingredients.map((item) => {
                        return {
                            "id": item.id,
                        }
                    })
                }
            }
        };
    
        const response = await dynamoLib.batchGet(params);
        const responses = response.Responses
        if(responses && isIngredientResponse(responses['ingredient'])) {
            ingredientData = responses['ingredient']
        }
        else {
            return {
                statusCode: 500,
                body: JSON.stringify({message: 'Malformed Ingredient in database'})
            }
        }
        outputRecipe = {
            ...recipeItem,
            ingredients: ingredientData.map((ingredient) => {
                const combineIngredient = ingredients.find((ingredientData: RecipeIngredientData) => {
                    return ingredientData.id == ingredient.id
                })
                const newIngredient: RecipeIngredient = {
                    amount: combineIngredient?.amount || "",
                    ...ingredient
                }
                return newIngredient
            })
        }
        
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    
    return {statusCode: 200, body: JSON.stringify(outputRecipe)};
}    

export const updateRecipe: APIGatewayProxyHandler = async (event) => {
    let data: Record<string, unknown>;
    if (event && event.body) {
        try {
            data = JSON.parse(event.body) as Record<string, unknown>;
        } catch(e) {
            return {
                // TODO: correct status code
                statusCode: 400,
                body: JSON.stringify({message: 'Malformed event body'})
            }
        }
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }

    if(!isRecipeRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determineRecipeRequestBodyFields(data)}`})
        }
    }


    const recipeRequest: RecipeRequestBody = data;

    if(!event || !event.pathParameters || !event.pathParameters.userId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const pathParameters = event.pathParameters;
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const recipeId = pathParameters.recipeId;
    let updatedData;
    try {
        const ingredients = await updateIngredients(recipeRequest.ingredients)

        const params: DynamoDB.DocumentClient.UpdateItemInput = {
            TableName: 'recipe',
            Key: {
                'userId': userId,
                'id': recipeId
            },
            UpdateExpression: "set steps = :s, ingredients = :i, updateTs = :t, #name = :n, description = :d",
            ExpressionAttributeValues:{
                ":s":recipeRequest.steps,
                ":i":ingredients,
                ":d":recipeRequest.description,
                ":n":recipeRequest.name,
                ":t": Date.now()
            },
            ExpressionAttributeNames: {
                '#name': 'name'
            },
            ReturnValues:"UPDATED_NEW"
            
        };
        updatedData = await dynamoLib.update(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    return {statusCode: 200, body: JSON.stringify(updatedData)};
}

export const deleteRecipe: APIGatewayProxyHandler = async (event) => {

    if(!event || !event.pathParameters || !event.pathParameters.userId || !event.pathParameters.recipeId) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: 'Malformed event body'})
        }
    }
    
    const recipeId = event.pathParameters.recipeId;
    let userId: string;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({message: 'Not authorized'})
        }
    }
    const params:  DynamoDB.DocumentClient.DeleteItemInput= {
        TableName: 'recipe',
        Key: {
            'userId': userId,
            'id': recipeId
        },
        ReturnValues: 'ALL_OLD'
    };
    let data;

    try {
        data = await dynamoLib.delete(params);
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    if(data.ConsumedCapacity) {
        return {statusCode: 404, body: JSON.stringify({message: 'Recipe not found'})};
    }
    return {statusCode: 200, body: JSON.stringify(data)};
}


