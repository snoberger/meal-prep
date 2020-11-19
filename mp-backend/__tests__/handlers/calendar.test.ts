import { expect } from "@jest/globals";
import { Event, createEvent } from "../utils/event.handler";
import dynamoDb from "../../src/libs/dynamodb-lib";
import Context from 'aws-lambda-mock-context';
import { createCalendar } from "../../src/handlers/calendar";


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