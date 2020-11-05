import {  APIGatewayProxyEvent} from "aws-lambda";

export type Event = {
    body?: string,
    pathParameters?: Record<string, string>
    identity?: {
        userArn?: string
    }
    principalId?: string
}
export const createEvent = (event: Event): APIGatewayProxyEvent => {
    // create an event object that will allow us to be properly formatted for the handler function
    const eventBody:APIGatewayProxyEvent = {
        headers: {test:''},
        body: event.body || '',
        multiValueHeaders: {test:['']},
        httpMethod: '',
        isBase64Encoded: false,
        path: '',
        pathParameters: event.pathParameters || {test:''},
        queryStringParameters: {test:''},
        multiValueQueryStringParameters: {test:['']},
        stageVariables: {test:''},
        requestContext: {
            accountId:'',
            apiId: '',
            authorizer: {
                principalId: event.principalId || '',
            },
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
                userArn: event.identity ? event.identity.userArn ? event.identity.userArn : '' : '',
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