/* eslint-disable @typescript-eslint/no-unsafe-call */
import { authLib } from "../../src/libs/authentication";
import crypto from 'crypto';

describe('authentication library', () => {

    const expiredToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNjQyMjA3Mi0wMjYyLTQwYWQtOTc0Yy0yMzU5MjdjYzAxOTUiLCJpYXQiOjE2MDM4MTMyNjQsImV4cCI6MCwiaXNzIjoicHJlcCJ9.Lkjq86oj1arh4Zhxc1qD7rBk47XPr9_Ou6Hj00NnguvE9M0GlsBkXu4W8TYQhasoxPMyXFI4YjaPs5D4C4P9tw';
    const wrongIssuerToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNjQyMjA3Mi0wMjYyLTQwYWQtOTc0Yy0yMzU5MjdjYzAxOTUiLCJpYXQiOjE2MDM4MTMyNjQsImV4cCI6OTk5OTk5OTk5OSwiaXNzIjoiV1JPTkcifQ.nG-8P9VVTIAyZqFkNGiZv0IY78a66sfO7kGKm3OAJEDKle1c0gqpnPDl2EQhGSVgsAZfmzTE5BwExSJaqwS3ZQ';
    const goodToken = 'eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIzNjQyMjA3Mi0wMjYyLTQwYWQtOTc0Yy0yMzU5MjdjYzAxOTUiLCJpYXQiOjE2MDM4MTMyNjQsImV4cCI6OTk5OTk5OTk5OSwiaXNzIjoicHJlcCJ9.72jRsU8sOI1TBiC3GV5vW9bYb3Q6YFzd61H0nxxW7Ah1TnYOj6rzWfJR2di2YdA7ayM503XEubz2tYVOr19BJQ';

    beforeEach(() => {
        jest.resetModules();
        process.env.PEPPER = 'SPICY';
        process.env.JWTSECRET = 'SECRET';
        // authLib.getHashedCredentials = jest.fn();
    });

    afterAll(() => {
        delete process.env.PEPPER;
        delete process.env.JWTSECRET;
        jest.resetAllMocks();
        jest.resetModules();
    })

    it('returns an error if no pepper is found', async () => {
        delete process.env.PEPPER;
        await expect(authLib.getHashedCredentials('foo', 'bar', 'baz')).rejects.toThrowError();
    });

    it('returns an error if generating the hash fails', async () => {
        crypto.pbkdf2 = jest.fn().mockImplementation(() => { throw new Error() });
        await expect(authLib.getHashedCredentials('foo', 'bar', 'baz')).rejects.toThrowError();
    });

    it('returns a JWT using good parameters', () => {
        expect(typeof authLib.generateJWT('userid')).toBe('string');
    });

    it('throws an error when generating a JWT with no secret', () => {
        delete process.env.JWTSECRET;
        expect(() => authLib.generateJWT('userid')).toThrow();
    });

    it('succesfully verifies a JWT', () => {
        const jwt: Record<string, unknown> = {exp: expect.any(Number), iat: expect.any(Number), iss: expect.any(String), userId: expect.any(String) };
        expect(authLib.verifyJWT(goodToken)).toEqual(expect.objectContaining(jwt));
    });

    it('throws an error when verifying a JWT with no secret', () => {
        delete process.env.JWTSECRET;
        expect(() => authLib.verifyJWT(goodToken)).toThrowError();
    });

    it('throws an error if the token was expired when verifying', () => {
        expect(() => authLib.verifyJWT(expiredToken)).toThrowError();
    });

    it('throws an error if the token had the wrong issuer when verifying', () => {
        expect(() => authLib.verifyJWT(wrongIssuerToken)).toThrowError();
    });

});