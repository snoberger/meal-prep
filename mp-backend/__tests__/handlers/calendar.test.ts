import { expect } from "@jest/globals";
import { Event, createEvent } from "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { createCalendar, getCalendar } from "../../src/handlers/calendar";


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
        event.body = JSON.stringify({'userId': '1234','time': 1, 'notify': 'yes', 'description': 'desc'});
        
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

    it('should return status code 400 and Malformed event body: "UserId not specified if the event does not have a userId', async () => {
        event.body = JSON.stringify({'time': 1, 'notify': 'yes', 'description': 'desc'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: UserId not specified")
    });

    it('should return status code 400 and Malformed event body: "Time not specified if the event does not have a time field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'notify': 'yes', 'description': 'desc'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Time not specified")
    });

    it('should return status code 400 and Malformed event body: "Notify not specified if the event does not have a notify field', async () => {
        event.body = JSON.stringify({'userId': '1234', 'time': 1, 'description': 'desc'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Notify not specified")
    });
    it('should return status code 400 and Malformed event body: "Description not specified if the event does not have a description field', async () => {
        event.body = JSON.stringify({'userId': '1234','time': 1, 'notify': 'yes'});
        

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(400);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Malformed event body: Description not specified")
    });


    it('should return status code 500 and Internal server error if dynamoDB.put fails', async () => {
        event.body = JSON.stringify({'userId': '1234','time': 1, 'notify': 'yes', 'description': 'desc'});
        dynamoDb.put = jest.fn().mockRejectedValueOnce({'error': 'Test Error'});
        
        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(500);
        expect(dynamoDb.put).toBeCalled();
    });

    it('should return Not authorized and status code 401 if no prinicpalId', async () => {
        event.body = JSON.stringify({'userId': '1234','time': 1, 'notify': 'yes', 'description': 'desc'});
        event.principalId = undefined;

        const result = await createCalendar(createEvent(event), Context(), () => {return});
        expect(result ? result.statusCode : false).toBe(401);
        expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toBe("Not authorized");
    });
    
});

describe('getCalendar', () => {
    const CalendarTable = {
        Calendar: {
            'userId': '1234',
            'id': '1',
            'time': 1,
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

    // it('should return status code 500 and Malformed event body if userId is missing', async () => {
        
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamoDb.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             steps: [],
    //             ingredients:[],
    //             id: 'id'
    //         }
    //     })
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("userId not specified")
    // });
    // it('should return status code 500 and Internal Server Error on empty get response', async () => {
        
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamoDb.get = jest.fn().mockResolvedValueOnce({})
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Internal server error")
    // });
    // it('should return status code 400 and Ingredient in body malformed ingredient empty', async () => {
        
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamoDb.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             steps: [],
    //             id: 'id',
    //             userId:'userId'
    //         }
    //     })
    //     dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({
    //         Responses: []
    //     })
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredients not specified")
    // });
    // it('should return status code 400 and Ingredients is not an array on ingredient empty', async () => {
        
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamoDb.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             steps: [],
    //             id: 'id',
    //             ingredients: {},
    //             userId:'userId'
    //         }
    //     })
    //     dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({
    //         Responses: []
    //     })
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredients is not an array")
    // });
    // it('should set amount if ingredient was not found', async () => {
        
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamoDb.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             steps: [],
    //             id: 'id',
    //             ingredients: [{
    //                 id: 'ing2',
    //                 amount: 0
    //             }],
    //             userId:'userId'
    //         }
    //     })
    //     dynamoDb.batchGet = jest.fn().mockResolvedValueOnce({
    //         Responses: {
    //             ingredient: [
    //                 {
    //                     id: 'ing1',
    //                     name: 'testName',
    //                     metric: 'testMetric'
    //                 }
    //             ]
    //         }
    //     })
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(200);
    // });
    // it('should return status code 500 and Malformed event body if id is missing', async () => {
        
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamoDb.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             steps: [],
    //             ingredients:[],
    //             userId: 'userId'
    //         }
    //     })
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("id not specified")
    // });
    // it('should throw error on malformed ingredient', async () => {
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                     id: "ing1",
    //                     name:'testName',
    //                 }
    //             ]
    //         }
    //     })
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    // });
    // it('should throw error on malformed database ingredient', async () => {
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                     id: "ing1",
    //                     amount: 1
    //                 }
    //             ]
    //         }
    //     })
    //     dynamodbLib.batchGet = jest.fn().mockResolvedValueOnce({Responses: {
    //         ingredient: [{
    //             id: 'ing1',
    //             name: 'testName',
    //         }]
    //     }})
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Malformed Ingredient in database");
    // });
    // it('should successfully get batch ingredients', async () => {
    //     event.pathParameters = {'userId': '1234', 'CalendarId': '1'};
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                     id: "ing1",
    //                     amount: 1
    //                 }
    //             ]
    //         }
    //     })
    //     dynamodbLib.batchGet = jest.fn().mockResolvedValueOnce({Responses: {
    //         ingredient: [{
    //             id: 'ing1',
    //             name: 'testName',
    //             metric: 'testMetric'
    //         }]
    //     }})
    //     const result = await getCalendar(createEvent(event), Context(), () => {return});
    //     expect(result ? result.statusCode : false).toBe(200);
    //     const Calendar = result ? (<CalendarTableEntry<CalendarIngredient>>JSON.parse(result.body)) : undefined
    //     const ingredients = Calendar?.ingredients || []
    //     expect(ingredients[0].amount).toBe(1)
    //     expect(ingredients[0].name).toBe('testName')
    // });
    // it('should return Ingredient in body malformed on missing amount Calendar get', async () => {
    //     event.pathParameters = { 'userId': '1234', 'CalendarId': '1' };
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                     id: "ing1",
    //                 }
    //             ]
    //         }
    //     })

    //     const result = await getCalendar(createEvent(event), Context(), () => { return });
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(dynamoDb.batchGet).toBeCalled(); 
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    
    // });
    // it('should return Ingredient in body malformed on missing id Calendar get', async () => {
    //     event.pathParameters = { 'userId': '1234', 'CalendarId': '1' };
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                     amount: 1,
    //                 }
    //             ]
    //         }
    //     })

    //     const result = await getCalendar(createEvent(event), Context(), () => { return });
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(dynamoDb.batchGet).toBeCalled(); 
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    
    // });
    // it('should return Ingredient in body malformed on empty ingredient', async () => {
    //     event.pathParameters = { 'userId': '1234', 'CalendarId': '1' };
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                 }
    //             ]
    //         }
    //     })

    //     const result = await getCalendar(createEvent(event), Context(), () => { return });
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(dynamoDb.batchGet).toBeCalled(); 
    //     expect(result ? (<LambdaBody>JSON.parse(result.body)).message : false).toContain("Ingredient in body malformed");
    
    // });
    // it('should return status code 500 and Internal server error if dynamoDB.get fails', async () => {
    //     event.pathParameters = { 'userId': '1234', 'CalendarId': '1' };
    //     dynamodbLib.get = jest.fn().mockResolvedValueOnce({
    //         Item: {
    //             ...CalendarTable.Calendar,
    //             ingredients: [
    //                 {
    //                     id: "ing1",
    //                     amount: 1
    //                 }
    //             ]
    //         }
    //     })
    //     dynamoDb.batchGet = jest.fn().mockRejectedValueOnce(()=> {throw 'error'});

    //     const result = await getCalendar(createEvent(event), Context(), () => { return });
    //     expect(result ? result.statusCode : false).toBe(500);
    //     expect(dynamoDb.batchGet).toBeCalled();
    // });

});