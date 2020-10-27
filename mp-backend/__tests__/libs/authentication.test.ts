/* eslint-disable @typescript-eslint/no-unsafe-call */
import { authLib } from "../../src/libs/authentication";
import crypto from 'crypto';
import { doesNotMatch } from "assert";

describe('authentication library', () => {

    beforeEach(() => {
        jest.resetModules();
        process.env.PEPPER = 'SPICY';
        // authLib.getHashedCredentials = jest.fn();
    });

    it('returns an error if no pepper is found', async () => {
        delete process.env.PEPPER;
        await expect(authLib.getHashedCredentials('foo', 'bar', 'baz')).rejects.toThrow();
    });

    it('returns an error if generating the hash fails', async () => {
        crypto.pbkdf2 = jest.fn().mockImplementation(() => { throw new Error() });
        await expect(authLib.getHashedCredentials('foo', 'bar', 'baz')).rejects.toThrowError();
    });
});