

import {Callback, Context } from 'aws-lambda'
import { APIGatewayAuthorizerResult, PolicyDocument } from 'aws-lambda/trigger/api-gateway-authorizer';
import { APIGatewayTokenAuthorizerEvent } from 'aws-lambda/trigger/api-gateway-authorizer'
import {authLib} from '../libs/authentication'

type Policy = {
    principalId: string,
    policyDocument: PolicyDocument
}

type JWTResponse = {
    userId: string,
    iat?: number, 
    exp?: number, 
    iss?: string
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


export const authenticateJWT = (event: APIGatewayTokenAuthorizerEvent, _context: Context, callback: Callback<APIGatewayAuthorizerResult>): void => {
    if (!event.authorizationToken) {
        return callback('Unauthorized');
    }
    
    const tokenParts = event.authorizationToken.split(' ');
    const tokenValue = tokenParts[1];
    if (!(tokenParts[0].toLowerCase() === 'bearer' && tokenValue)) {
        return callback('Unauthorized');
    }
    try {
        //throws error if invalid but making sure decoded data is expected format
        const result: JWTResponse = (<JWTResponse>authLib.verifyJWT(tokenValue))
        if(result && result.userId){
            return callback(null, generatePolicy(result.userId, 'Allow', event.methodArn))
        }
    } catch (e) {
        return callback('Unauthorized');
    }
    return callback('Unauthorized');
}
