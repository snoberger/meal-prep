/* eslint-disable @typescript-eslint/no-unsafe-call */
import { APIGatewayTokenAuthorizerEvent } from "aws-lambda";
import mockContext from "aws-lambda-mock-context";
import { authenticateJWT } from "../../src/middleware/authenticateJWT";
import {authLib} from '../../src/libs/authentication'



describe('athenticateJWT', () => {

    const goodToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNjQyMjA3Mi0wMjYyLTQwYWQtOTc0Yy0yMzU5MjdjYzAxOTUiLCJpYXQiOjE2MDM4MTMyNjQsImV4cCI6OTk5OTk5OTk5OSwiaXNzIjoicHJlcCJ9.72jRsU8sOI1TBiC3GV5vW9bYb3Q6YFzd61H0nxxW7Ah1TnYOj6rzWfJR2di2YdA7ayM503XEubz2tYVOr19BJQ';
    const goodPolicy = {
        policyDocument: {   
            Statement: [
                {
                    Action: "execute-api:Invoke", 
                    Effect: "Allow", 
                    Resource: "testARN"
                }
            ], 
            Version: "2012-10-17"
        }, 
        principalId: "36422072-0262-40ad-974c-235927cc0195"
    }
    const authLibTemp = authLib.verifyJWT
    beforeEach(() => {
        jest.resetModules();
        process.env.JWTSECRET = 'SECRET';
        authLib.verifyJWT = authLibTemp;
    });

    it('returns with a valid Policy if jwt is correct', (done) => {
        const event: APIGatewayTokenAuthorizerEvent = {
            authorizationToken: 'bearer ' + goodToken,
            type: 'TOKEN',
            methodArn: 'testARN',
        }
        const mockCallback = jest.fn()
        authenticateJWT(event, mockContext(), mockCallback);
        expect(mockCallback).toBeCalledWith(null, goodPolicy)
        done()
    });

    it('fails if improperly formatted no bearer', (done) => {
        const event: APIGatewayTokenAuthorizerEvent = {
            authorizationToken: goodToken,
            type: 'TOKEN',
            methodArn: 'testARN',
        }
        const mockCallback = jest.fn()
        authenticateJWT(event, mockContext(), mockCallback);
        expect(mockCallback).toBeCalledWith("Unauthorized")
        done()
    });

    it('fails if improperly formatted bad bearer', (done) => {
        const event: APIGatewayTokenAuthorizerEvent = {
            authorizationToken: 'bad' + goodToken,
            type: 'TOKEN',
            methodArn: 'testARN',
        }
        const mockCallback = jest.fn()
        authenticateJWT(event, mockContext(), mockCallback);
        expect(mockCallback).toBeCalledWith("Unauthorized")
        done()
    });

    it('fails if no token', (done) => {
        const event: APIGatewayTokenAuthorizerEvent = {
            authorizationToken: '',
            type: 'TOKEN',
            methodArn: 'testARN',
        }
        const mockCallback = jest.fn()
        authenticateJWT(event, mockContext(), mockCallback);
        expect(mockCallback).toBeCalledWith("Unauthorized")
        done()
    });

    it('fails if format of return is invalid', (done) => {
        const event: APIGatewayTokenAuthorizerEvent = {
            authorizationToken: 'bearer ' + goodToken,
            type: 'TOKEN',
            methodArn: 'testARN',
        }
        authLib.verifyJWT = jest.fn().mockImplementation(()=> {
            return 'error'
        })
        const mockCallback = jest.fn()
        authenticateJWT(event, mockContext(), mockCallback);
        expect(mockCallback).toBeCalledWith("Unauthorized")
        done()
    });

    it('fails if error thrown', (done) => {
        const event: APIGatewayTokenAuthorizerEvent = {
            authorizationToken: 'bearer ' + goodToken,
            type: 'TOKEN',
            methodArn: 'testARN',
        }
        authLib.verifyJWT = jest.fn().mockImplementation(()=> {
            throw 'error'
        })
        jest.mock('../../src/libs/authentication', ()=> {
            return {
                verifyJWT: ()=> {
                    throw 'error'
                }
            }
        })
        const mockCallback = jest.fn()
        authenticateJWT(event, mockContext(), mockCallback);
        expect(mockCallback).toBeCalledWith("Unauthorized")
        done()
    });

});