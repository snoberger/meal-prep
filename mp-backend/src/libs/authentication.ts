import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

interface AuthLib {
    getHashedCredentials: (username: string, password: string, salt: string) => Promise<string>,
    generateJWT: (userId: string) => string,
    verifyJWT: (jwt: string) => Record<string, unknown>;
}

interface JWTLib {
    sign: (
        payload: string | Buffer | Record<string, unknown>,
        secretOrPrivateKey: jwt.Secret,
        options?: jwt.SignOptions,
    ) => string;

    verify: (
        token: string, 
        secretOrPublicKey: jwt.Secret, 
        options?: jwt.VerifyOptions
    ) => Record<string, unknown>;
}

export const authLib: AuthLib = {
    getHashedCredentials: async (username: string, password: string, salt:string): Promise<string>  => {
        const pepper = process.env.PEPPER;
        if(!pepper) {
            throw new Error('No pepper found.');
        }

        const hashPromise = new Promise<string>((resolve, reject) => {
            crypto.pbkdf2(username + password, salt + pepper, 99999, 512, 'sha512', (err, derivedKey) => {
                /* istanbul ignore next */
                if(err) {
                    reject(err);
                } else {
                    resolve(derivedKey.toString('hex'));
                }
            });
        });

        let userPassHash: string;
        try {
            userPassHash = await hashPromise;
        } catch (e) {
            throw new Error('Could not create the hash sucessfully.');
        }

        return userPassHash;
    },

    generateJWT: (userId: string): string => {
        const secret = process.env.JWTSECRET;
        if(!secret) {
            throw new Error('No JWT secret found.');
        }

        return (<JWTLib>jwt).sign({'userId': userId}, secret, {algorithm: 'HS512', expiresIn: '1 day', issuer: 'prep'});
    },

    verifyJWT: (token: string): Record<string, unknown> => {
        // check that the algorith matches the one that we specify, otherwise we could be vulnerable to a 'none' attack
        // our secret should be at least 512 bits (64 ascii chars), this will need to be update

        // Verify that now is later than the issued at date 
        // Verify that is hasn't expired
        // Verify that the issuer is us
        const secret = process.env.JWTSECRET;
        if(!secret) {
            throw new Error('No JWT secret found.');
        }

        const options: jwt.VerifyOptions = {
            algorithms: ['HS512'],
            issuer: 'prep'
        }

        const result: Record<string, unknown> = (<JWTLib>jwt).verify(token, secret, options);
        return result;
    }
}
