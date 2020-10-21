import type {Config} from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    testMatch: ['**/*.test.ts'],
    testPathIgnorePatterns: ["/node_modules/"],
    coveragePathIgnorePatterns: ["__tests__"],
    coverageThreshold: {
        "global": {
            branches: 100,
            functions: 100,
            lines: 100,
            statements: 100
        }
    }
};
export default config;