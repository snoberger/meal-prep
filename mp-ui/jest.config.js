const esModules = ['@agm', 'ngx-bootstrap', 'lodash-es'].join('|');

module.exports = {
  collectCoverageFrom: ["tests/**/*.{ts,tsx,mjs}"],
  testMatch: ["<rootDir>/tests/**/*.spec.{ts,tsx,mjs}"],
  transform: {
    '^.+\\.(tsx|jsx|ts|js|html)$': 'ts-jest',
    ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css"
  },
  setupFilesAfterEnv: [
    "<rootDir>/tests/setupTests.ts"
  ]
};