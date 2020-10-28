module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,mjs}"],
  testMatch: ["<rootDir>/tests/**/*.spec.{ts,tsx,mjs,js,jsx}" ],
  transform: {
    '^.+\\.(tsx|jsx|ts|js|html)$': 'ts-jest',
    ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css"
  },
  setupFilesAfterEnv: [
    "<rootDir>/tests/setupTests.ts"
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/serviceWorker.ts', '<rootDir>/src/index.tsx', '<rootDir>/src/react-app-env.d.ts'],
};