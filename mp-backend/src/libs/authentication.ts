import crypto from 'crypto';

interface AuthLib {
    getHashedCredentials: (username: string, password: string, salt: string) => Promise<string>;
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
    }
}
