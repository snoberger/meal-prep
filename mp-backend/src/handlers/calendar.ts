import { APIGatewayProxyHandler } from "aws-lambda";
import DynamoDB from 'aws-sdk/clients/dynamodb';
import dynamoLib from '../libs/dynamodb-lib';
import { getPrincipleId } from "../middleware/validation";
import { v4 as uuidv4 } from 'uuid';
import { CalendarRequestBody, CalendarTableEntry } from "./calendar.types";

function determineCalendarRequestBodyFields(data: Record<string, unknown>): string  {
    if(!('userId' in data)) {
        return "UserId not specified";
    }
    if(!('time' in data)) {
        return "Time not specified";
    }
    if(!('notify' in data)) {
        return "Notify not specified";
    }
    if(!('description' in data)) {
        return "Description not specified";
    }
    return "";
}
function isCalendarRequestBody(data: Record<string, unknown>): data is CalendarRequestBody {
    return !determineCalendarRequestBodyFields(data);
}
export const createCalendar: APIGatewayProxyHandler = async (event) => {
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

    if(!isCalendarRequestBody(data)) {
        return {
            statusCode: 400,
            body: JSON.stringify({message: `Malformed event body: ${determineCalendarRequestBodyFields(data)}`})
        }
    }


    const calendarRequest: CalendarRequestBody = data;

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
        // const ingredients = await updateIngredients(data.ingredients)
        
        const newCalendarEntry: CalendarTableEntry = {
            'id': uuidv4(),
            'userId': userId,
            'time': calendarRequest.time,
            'notify': calendarRequest.notify,
            'description': calendarRequest.description,
            'createTs': Date.now(),
            'updateTs': Date.now()
        }
        const params: DynamoDB.DocumentClient.PutItemInput = {
            TableName: 'calendar',
            Item: newCalendarEntry,
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