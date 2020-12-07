import { APIGatewayProxyHandler } from 'aws-lambda';
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { getPrincipleId } from '../middleware/validation';
import { RecipeTableEntry, RecipeIngredientData } from './recipe.types';
import { getAllPantry } from "../handlers/pantry";
import { PantryIngredientData, PantryTableEntry } from "./pantry.types";
import { Ingredient } from "./ingredient.types";
import aws  from 'aws-sdk';
import { generateTemplate } from '../libs/email';
import { UserTableEntry } from './user';
const ses = new aws.SES()

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
// const myDomain = process.env.DOMAIN

export interface GroceryListRequestBody extends Record<string, unknown> {
    recipes: RecipeId[]
}

export function isRecipeListRequestBody(data: Record<string, unknown>): data is GroceryListRequestBody {
    return 'recipes' in data && data.recipes instanceof Array;
}
// TOOD: this type guard could use somework
function isPantryTableEntryArray(data: Record<string, unknown>[]): data is PantryTableEntry[] {
    let isValid = true;
    for(const i of data){
        if(!('ingredients' in i)) {
            isValid = false
        }
    }
    return isValid;
}

function ingredientMappingToString(recipeMap: IngredientMapping, pantryMap: IngredientMapping): string {
    let str = "<ul>";
    recipeMap.forEach((metricMap, name) => {
        metricMap.forEach((amount, metric) => {
            let ingredientsYouHave = "You have: ";
            if(pantryMap.has(name)) {
                const pantryMetricMap: Map<IngredientMetric, IngredientAmount> | undefined = pantryMap.get(name);
                /* istanbul ignore else */
                if(pantryMetricMap) {
                    pantryMetricMap.forEach((amount, metric) => {
                        if(ingredientsYouHave == 'You have: ')
                            ingredientsYouHave += `${amount} ${metric}`
                        else
                            ingredientsYouHave += `, ${amount} ${metric}`
                    });
                }
            }
            if(ingredientsYouHave != 'You have: ')
                str += `<li>${name} - ${amount} ${metric} (${ingredientsYouHave})</li>`;
            else
                str += `<li>${name} - ${amount} ${metric}</li>`;
        });
    });

    return str + "</ul>";
}

function fractionToDecimal(fraction: string): number {
    // We are already a number
    if (!isNaN(+fraction) && !isNaN(parseFloat(fraction))) {
        return parseFloat(fraction);
    }

    if (fraction.includes("/")) {
        const parts = fraction.split('/');
        if(parts.length > 2) {
            throw new Error("Not a valid fraction");
        }
        let numerator = 0;
        let denominator = 0;
        if (!isNaN(+parts[0]) && !isNaN(parseFloat(parts[0]))) {
            numerator = parseFloat(parts[0]);
        } else {
            throw new Error("Not a valid fraction");
        }
        if (!isNaN(+parts[1]) && !isNaN(parseFloat(parts[1]))) {
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
function buildCollatedIngredients(ingredients: Array<CollatedIngredientEntry>): IngredientMapping {
    const collatedIngredients: IngredientMapping = new Map<IngredientName, Map<IngredientMetric, IngredientAmount>>();
    for (const ingredient of ingredients) {
        if (collatedIngredients.has(ingredient.name.toLowerCase())) {
            const metricMap = collatedIngredients.get(ingredient.name.toLowerCase());
            if (metricMap?.has(ingredient.metric.toLowerCase())) {
                let amount = metricMap.get(ingredient.metric);

                // We should always have a map, metric, and amount if we get to this point, this is just to appease
                // typescript
                /* istanbul ignore next */
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

export function generateGetRecipeParameters(userId: Uuid, recipeId: RecipeId): DynamoDB.GetItemInput {
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'recipe',
        Key: {
            'userId': userId,
            'id': recipeId
        }
    }

    return params;
}

function generateGetUserParameters(userId: Uuid) {
    const params: DynamoDB.DocumentClient.GetItemInput = {
        TableName: 'user',
        Key: {
            'id': userId,
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

async function collateIngredientData(ingredient: RecipeIngredientData | PantryIngredientData): Promise<CollatedIngredientEntry> {
    const ingredientData = await dynamoLib.get(generateGetIngredientParameters(ingredient.id));
    if (!ingredientData.Item) {
        throw new Error('Could not lookup ingredient id');
    }

    const allIngredientData: Ingredient = <Ingredient>ingredientData.Item;

    const collatedIngredient: CollatedIngredientEntry = {
        'name': allIngredientData.name,
        'metric': allIngredientData.metric,
        'amount': ingredient.amount
    }
    return collatedIngredient;
}

function generateEmailParams (ingredients: string, email: string): aws.SES.SendEmailRequest {

    if(process.env.EMAIL) {
        return {
            Source: process.env.EMAIL,
            Destination: { ToAddresses: [email] },
            Message: {
                Body: {
                    Html: {
                        Charset: 'UTF-8',
                        Data: generateTemplate('grocery-list', ingredients)
                    }
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `Grocey List from Pre-Prep Meal-Prep!`
                }
            }
        }
    }
    throw new Error('Missing Email')
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

    if (!isRecipeListRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Malformed event body: request must contain a recipes array, containing recipeIds` })
        }
    }

    // Build the ingredient mapping of ingredients that we already have
    // It is guaranteed that pathParameters are not null, appease TS
    /* istanbul ignore next */
    event.pathParameters = event.pathParameters || {};
    event.pathParameters.userId = userId;
    let pantryItemsResponse: {statusCode: number, body: string};
    try {
        pantryItemsResponse = await getAllPantry(event, context, cb) as { statusCode: number, body: string };
    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        }
    }

    if(pantryItemsResponse.statusCode != 200) {
        return {
            statusCode: 500,
            body: JSON.stringify({message: 'Internal server error'})
        }
    }
    
    let pantryEntries: PantryTableEntry[] | undefined;
    try {
        const temp: Record<string, unknown>[] = JSON.parse(pantryItemsResponse.body) as Record<string, unknown>[];
        if(isPantryTableEntryArray(temp)) {
            pantryEntries = temp;
        } else {
            return {
                statusCode: 500,
                body: JSON.stringify({ message: 'Internal server error' })
            }
        }

    } catch (e) {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal server error' })
        }
    }
    const pantryIngredients: Array<CollatedIngredientEntry> = [];
    for(const pantry of pantryEntries) {
        for(const ingredient of pantry.ingredients) {
            try {
                pantryIngredients.push(await collateIngredientData(ingredient));
            } catch (e) {
                return {
                    statusCode: 500,
                    body: JSON.stringify({message: 'Internal server error'})
                }
            }
        }
    }

    const pantryMapping: IngredientMapping = buildCollatedIngredients(pantryIngredients);

    // Get the ingredients that are necessary
    const allRecipeIds: Array<RecipeId> = data.recipes;
    const allIngredients: Array<CollatedIngredientEntry> = [];
    for (const id of allRecipeIds) {
        try {
            const result = await dynamoLib.get(generateGetRecipeParameters(userId, id));

            if (!result.Item) {
                continue;
            }

            const asEntry = <RecipeTableEntry>result.Item;
            for (const ingredient of asEntry.ingredients) {
                allIngredients.push(await collateIngredientData(ingredient));
            }

        } catch (e) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: `Malformed event body: could not find recipe matching id ${id}` })
            }
        }
    }

    const recipeMapping: IngredientMapping = buildCollatedIngredients(allIngredients);
    const stringifiedIngredients = ingredientMappingToString(recipeMapping, pantryMapping);
    let emailRecipient = ""
    try {
        const result = await dynamoLib.get(generateGetUserParameters(userId));
        if (!result.Item) {
            throw new Error('missing user')
        }
        const asEntry = <UserTableEntry>result.Item;
        emailRecipient = asEntry.username;
    } catch (e) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: `Malformed event body: could not find user id ${userId}` })
        }
    }

    try {
        const emailParams = generateEmailParams(stringifiedIngredients, emailRecipient)
        
        await ses.sendEmail(emailParams).promise()
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify({ message: stringifiedIngredients })
        }
    } catch (err) {
        // eslint-disable-next-line
        console.log(err)
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `email fail` })
        }
    }
}