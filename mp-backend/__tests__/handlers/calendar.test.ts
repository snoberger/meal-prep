import { expect } from "@jest/globals";
import { Event, createEvent } from "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { createCalendar, deleteCalendar, getAllCalendar, getCalendar, updateCalendar, calendarDateRange } from "../../src/handlers/calendar";
import dynamodbLib from "../../src/libs/dynamodb-lib";
import { CalendarRequestBody } from "../../src/handlers/calendar.types";


interface LambdaBody {
    message: string
}

describe('createCalendar', () => {
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

        const result = await createCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (trailing comma case)', async () => {
        const event = {
            body: '{"username": "singleQuote", "password": "SingleQuote",}'
        }

        const result = await createCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
    });

    it('should return 200 and success message when putting a new calendar event', async () => {
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes', 'description': 'desc'});
        
        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(201);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("success")
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have a body', async () => {
        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: "Date not specified if the event does not have a time field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'notify': 'yes', 'description': 'desc'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Date not specified")
    });

    it('should return status code 400 and Malformed event body: "Notify not specified if the event does not have a notify field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'date': new Date(), 'description': 'desc'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Notify not specified")
    });
    it('should return status code 400 and Malformed event body: "Description not specified if the event does not have a description field', async () => {
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Description not specified")
    });


    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes', 'description': 'desc'});
        dynamoDb.put = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes', 'description': 'desc'});
        event.principalId = undefined;

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
    
});
describe('getAllCalendarEntries', () => {
    const curDate = new Date(Date.now())
    const calendarTable = {
        calendar: {
            'userId': '1234',
            'id': '1',
            'date': curDate,
            'description': 'desc',
            'notify': 'yes'

        },
        calendar2: {
            'userId': '1234',
            'id': '2',
            'date':curDate,
            'description': 'desc',
            'notify': 'yes'


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

    it('should return all calendar events based on userId', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamoDb.query = jest.fn().mockResolvedValueOnce({Item: [calendarTable.calendar, calendarTable.calendar2]});
        
        const result = await getAllCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode: false).toBe(200);
        expect(dynamoDb.query).toBeCalled();
    });

    
    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {

        const result = await getAllCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = {'recipeId': '1'};

        const result = await getAllCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.query fails', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamoDb.query = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await getAllCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.query).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'userId': '1234'};
        event.principalId = undefined;

        const result = await getAllCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
    it('should return', async () => {
        event.pathParameters = {'userId': '1234'};
        dynamodbLib.query = jest.fn().mockResolvedValueOnce({Items: [
            {
                id: 'recipeId1',
                date: curDate,
                notify: 'yes',
                description: 'description'
            }
        ]});
        const result = await getAllCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        const calendarItems = result ? (<CalendarRequestBody[]>JSON.parse(result.body)) : [];
        expect(calendarItems[0].id).toBe('recipeId1')
        expect(calendarItems[0].notify).toBe('yes')
        expect(calendarItems[0].description).toBe('description')
    });


});

describe('getCalendar', () => {
    const CalendarTable = {
        Calendar: {
            'userId': '1234',
            'id': '1',
            'date': new Date(),
            'notify': 'test',
            'description': 'hi'

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

    it('should return a Calendar based on its ID', async () => {
        event.pathParameters = {'userId': '1234', 'calendarId': '1'};
        dynamoDb.get = jest.fn().mockResolvedValueOnce({Item: CalendarTable.Calendar});
        
        const result = await getCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await getCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = {'calendarId': '1'};

        const result = await getCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have calendarId', async () => {
        event.pathParameters = {'userId': '1'};

        const result = await getCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
        event.pathParameters = {'userId': '1234', 'calendarId': '1'};
        dynamoDb.get = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});

        const result = await getCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.get).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = {'userId': '1234', 'calendarId': '1'};
        event.principalId = undefined;

        const result = await getCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

   

});


describe('update Calendar entry', () => {
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

    it('should return 200 and success message when putting a new Calendar', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes', 'description': 'desc'});

        const result = await updateCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await updateCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body: "Date not specified" if the event does not have a time field', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        event.body = JSON.stringify({'userId': '1234', 'notify': 'yes', 'description': 'desc'});
        

        const result = await updateCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Date not specified")
    });

    it('should return status code 400 and Malformed event body: "Notify not specified" if the event does not have a notify field', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        event.body = JSON.stringify({'userId': '1234', 'date': new Date(), 'description': 'desc'});
        

        const result = await updateCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Notify not specified")
    });
    it('should return status code 400 and Malformed event body: "Description not specified" if the event does not have a description field', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes'});
        

        const result = await updateCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Description not specified")
    });

    it('returns malformed data error when a user passes in non-JSON parsable body (single quote case)', async () => {
        event.pathParameters = { 'calendarId': '1', 'userId':'1234'};
        event.body = "{\"username\": 'singleQuote', \"password\": 'SingleQuote'}";
        const result = await updateCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('returns malformed data error when a user passes in no body', async () => {
        event.pathParameters = { 'calendarId': '1', 'userId':'1234'};
        const result = await updateCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.update fails', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1'};
        event.body = JSON.stringify({'userId': '1234','date': new Date(), 'notify': 'yes', 'description': 'desc'});
        dynamoDb.update = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await updateCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.update).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1'};
        event.principalId = undefined;

        const result = await updateCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

});


describe('delete calendar entry', () => {
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

    it('should delete a calendar based on its ID', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({ "Attributes": {} });

        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = { 'calendarId': '1' };

        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });
    it('should return status code 400 and Malformed event body if the pathparameters does not have calendarId', async () => {
        event.pathParameters = { 'userId': '1234' };

        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 500 and Internal server error if dynamoDB.delete fails', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        dynamoDb.delete = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.delete).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        event.principalId = undefined;

        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });


    it('should return 404 calendar not found if deleting a calendarId that does not exist', async () => {
        event.pathParameters = { 'userId': '1234', 'calendarId': '1' };
        dynamoDb.delete = jest.fn().mockResolvedValueOnce({ "ConsumedCapacity": {} });

        const result = await deleteCalendar(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(404);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Calendar not found");
    });
});

describe('calendar date range', () => {
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

    it('should return status code 200 and events within a date range', async() => {
        event.pathParameters = { 'userId': '1234', 'startDate': '2020-12-02', 'endDate': '2020-12-03' };
        dynamoDb.query = jest.fn().mockResolvedValueOnce({ 'Items': [{ 'description': 'event1' }]});

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(200);
        expect(result ? (<LambdaBody>JSON.parse(result.body)) : false).toEqual([{'description': 'event1'}]);
        expect(dynamoDb.query).toBeCalled();
    });


    it('should return status code 400 and Malformed event body if the event does not have pathParameters', async () => {
        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have userId', async () => {
        event.pathParameters = { 'startDate': '1' };

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have startDate', async () => {
        event.pathParameters = { 'userId': '1234' };

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return status code 400 and Malformed event body if the pathparameters does not have endDate', async () => {
        event.pathParameters = { 'userId': '1234', 'startDate': '1' };

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body")
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.pathParameters = { 'userId': '1234', 'startDate': '2020-12-02', 'endDate': '2020-12-03' };
        event.principalId = undefined;

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });

    it('should return 400 and Illegal date format if startDate is not well formatted', async () => {
        event.pathParameters = { 'userId': '1234', 'startDate': '1', 'endDate': '2020-12-02' };

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Illegal date format");
    });

    it('should return 400 and Illegal date format if endDate is not well formatted', async () => {
        event.pathParameters = { 'userId': '1234', 'startDate': '2020-12-02', 'endDate': '1' };

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Illegal date format");
    });

    it('should return 500 and Internal server error if dynamodb query fails', async () => {
        event.pathParameters = { 'userId': '1234', 'startDate': '2020-12-02', 'endDate': '2020-12-03' };
        dynamoDb.query = jest.fn().mockRejectedValueOnce({ 'error': 'Test Error' });

        const result = await calendarDateRange(createEvent(event), Context(), () => { return });
        expect(result ? result.statusCode : false).toBe(500);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Internal server error");
        expect(dynamoDb.query).toBeCalled();
    });
});