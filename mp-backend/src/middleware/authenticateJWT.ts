

import {Callback, Context } from 'aws-lambda'
import { APIGatewayAuthorizerResult, PolicyDocument } from 'aws-lambda/trigger/api-gateway-authorizer';
import { APIGatewayTokenAuthorizerEvent, Statement } from 'aws-lambda/trigger/api-gateway-authorizer'
import {authLib} from '../libs/authentication'

type Policy = {
    principalId: string,
    policyDocument: PolicyDocument
}
const generatePolicy = (principalId: string, effect: string, resource: string): Policy => {
    const policyDocument: PolicyDocument = {
        Version: '2012-10-17',
        Statement: [
            {
                Action:'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }
        ]
    };
    const authResponse: Policy = {
        principalId: principalId,
        policyDocument
    };
    return authResponse;
};


export const authenticateJWT = (event: APIGatewayTokenAuthorizerEvent, _context: Context, callback: Callback<APIGatewayAuthorizerResult>) => {
    console.log(event)
    // if(!event.authorizationToken){
        // callback('Unauthorized')
    // }
    console.log(event)
    return callback(null, generatePolicy('1', 'Allow', event.methodArn))
}
