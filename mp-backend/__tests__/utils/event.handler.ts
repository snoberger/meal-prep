import {  APIGatewayProxyEvent} from "aws-lambda";

type Event = {
    body?: string
}
export const createEvent = (event: Event): APIGatewayProxyEvent => {
    // create an event object that will allow us to be properly formatted for the handler function
    const eventBody:APIGatewayProxyEvent = {
        headers: {test:''},
        body: event.body ? event.body : '',
        multiValueHeaders: {test:['']},
        httpMethod: '',
        isBase64Encoded: false,
        path: '',
        pathParameters: {test:''},
        queryStringParameters: {test:''},
        multiValueQueryStringParameters: {test:['']},
        stageVariables: {test:''},
        requestContext: {
            accountId:'',
            apiId: '',
            authorizer: {},
            protocol: '',
            httpMethod: '',
            path: '',
            identity: {
                accessKey: '', 
                accountId: '', 
                apiKey: '',
                apiKeyId: '',
                caller: '', 
                cognitoAuthenticationProvider: '',
                cognitoAuthenticationType: '',
                cognitoIdentityId: '',
                cognitoIdentityPoolId: '', 
                principalOrgId: '', 
                sourceIp: '',
                user: '',
                userAgent: '',
                userArn: '',
            },
            stage: '', 
            requestId: '',
            requestTimeEpoch: 0,
            resourceId: '',
            resourcePath: ''
        },
        resource: '',
    }
    return eventBody
}