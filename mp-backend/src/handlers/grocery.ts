import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { getPrincipleId } from '../middleware/validation';
import { RecipeTableEntry } from './recipe.types';
import { getPantry, getAllPantry } from "../handlers/pantry";

type Uuid = string;
type RecipeId = Uuid;
type IngredientName = string;
type IngredientMetric = string;
type IngredientAmount = number;
type IngredientMapping = Map<IngredientName, Map<IngredientMetric, IngredientAmount>>;

interface CollatedIngredientEntry {
    name: string,
    amount: string,
    metric: string
}

export interface GroceryListRequestBody extends Record<string, unknown> {
    recipes: RecipeId[]
}

function isGroceryListRequestBody(data: Record<string, unknown>): data is GroceryListRequestBody {
    return 'recipes' in data && data.recipes instanceof Array;
}

function ingredientMappingToString(map: IngredientMapping): string {
    let str = "";

    map.forEach((metricMap, name) => {
        metricMap.forEach((amount, metric) => {
            str += `${name} - ${amount} ${metric}\n`;
        });
    });

    return str;
}

function fractionToDecimal(fraction: string): number {
    // We are already a number
    if(!isNaN(+fraction) && !isNaN(parseFloat(fraction))) {
        return parseFloat(fraction);
    }

    if(fraction.includes("/")) {
        const parts = fraction.split('/');
        let numerator = 0;
        let denominator = 0;
        if(!isNaN(+parts[0]) && !isNaN(parseFloat(parts[0]))) {
            numerator = parseFloat(parts[0]);
        } else {
            throw new Error("Not a valid fraction");
        }
        if(!isNaN(+parts[1]) && !isNaN(parseFloat(parts[1]))) {
            denominator = parseFloat(parts[1]);
        } else {
            throw new Error("Not a valid fraction");
        }

        return numerator / denominator;
    }

    throw new Error("Not a valid fraction");
}

// If an amount is not parsable, it will not be added to the list.
// This is because amounts should have been validated somewhere else, either in the backend
// when creating a recipe/pantry item or on the frontend when the user in inputting data.
function buildCollatedIngredients(ingredients: Array<CollatedIngredientEntry>, pantry: IngredientMapping): IngredientMapping {
    const collatedIngredients: IngredientMapping = new Map<IngredientName, Map<IngredientMetric, IngredientAmount>>();
    for (const ingredient of ingredients) {
        if (collatedIngredients.has(ingredient.name.toLowerCase())) {
            const metricMap = collatedIngredients.get(ingredient.name);
            if (metricMap?.has(ingredient.metric.toLowerCase())) {
                let amount = metricMap.get(ingredient.metric);
                if (!amount) {
                    throw new Error('Illegal ingredient mapping');
                }

                let amnt = 0;
                try {
                    amnt = fractionToDecimal(ingredient.amount);
                } catch (e) {
                    continue;
                }
                amount += amnt;
                metricMap?.set(ingredient.metric.toLowerCase(), amount);
            } else {
                let amnt = 0;
                try {
                    amnt = fractionToDecimal(ingredient.amount);
                } catch (e) {
                    continue;
                }
                metricMap?.set(ingredient.metric.toLowerCase(), amnt);
            }
        } else {
            const insertMetricMap = new Map<IngredientMetric, IngredientAmount>();
            let amnt = 0;
            try {
                amnt = fractionToDecimal(ingredient.amount);
            } catch (e) {
                continue;
            }
            insertMetricMap.set(ingredient.metric.toLowerCase(), amnt);
            collatedIngredients.set(ingredient.name.toLowerCase(), insertMetricMap);
        }
    }
    return collatedIngredients;
}

function generateGetRecipeParameters(userId: Uuid, recipeId: RecipeId) {
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'recipe',
        Key: {
            'userId': userId,
            'id': recipeId
        }
    }

    return params;
}

function generateGetIngredientParameters(ingredientId: Uuid) {
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'ingredient',
        Key: {
            'id': ingredientId
        }
    }
    return params;
}

export const generate: APIGatewayProxyHandler = async (event, context, cb) => {
    let userId: Uuid;
    try {
        userId = getPrincipleId(event);
    } catch {
        return {
            statusCode: 401,
            body: JSON.stringify({ message: 'Not authorized' })
        }
    }


    let data: Record<string, unknown>;
    if (event && event.body) {
        try {
            data = JSON.parse(event.body) as Record<string, unknown>;
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Malformed request body' })
            }
        }
    } else {
        return {
            // TODO: correct status code
            statusCode: 400,
            body: JSON.stringify({ message: 'Bad request' })
        }
    }

    if (!isGroceryListRequestBody) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Malformed event body: request must contain a recipes array, containing recipeIds` })
        }
    }

    // Build the ingredient mapping of ingredients that we already have
    event.pathParameters = {};
    event.pathParameters.userId = userId;
    const pantryId = await getAllPantry(event, context, cb);
    console.log(pantryId);
    

    // Get the ingredients that are necessary
    const allRecipeIds: Array<RecipeId> = (<GroceryListRequestBody>data).recipes;
    const allIngredients: Array<CollatedIngredientEntry> = [];
    for (const id of allRecipeIds) {
        try {
            const result = await dynamoLib.get(generateGetRecipeParameters(userId, id));

            if(!result.Item) {
                continue;
            }

            const asEntry = <RecipeTableEntry>result.Item;
            for(const ingredient of asEntry.ingredients) {
                const ingredientData = await dynamoLib.get(generateGetIngredientParameters(ingredient.id));
                if(!ingredientData.Item) {
                    continue;
                }
                const ing: Ingredient = <Ingredient>ingredientData.Item;

                const thisIngredient: CollatedIngredientEntry = {
                    'name': ing.name,
                    'metric': ing.metric,
                    'amount': ingredient.amount
                }
                allIngredients.push(thisIngredient);
            }
            
        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: `Malformed event body: could not find reicpe matching id ${id}` })
            }
        }
    }

    let stringifiedIngredients = "";
    try {
        stringifiedIngredients = ingredientMappingToString(buildCollatedIngredients(allIngredients));
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: stringifiedIngredients })
    }
}