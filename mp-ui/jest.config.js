module.exports = {
  collectCoverageFrom: ["src/**/*.{ts,tsx,mjs}", "src\\**\\*.{ts,tsx,mjs}"],
  testMatch: ["<rootDir>/tests/**/*.spec.{ts,tsx,mjs,js,jsx}" ],
  transform: {
    '^.+\\.(tsx|jsx|ts|js|html)$': 'ts-jest',
    ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css"
  },
  setupFilesAfterEnv: [
    "<rootDir>/tests/setupTests.ts"
  ],
  coveragePathIgnorePatterns: ['<rootDir>/src/serviceWorker.ts', '<rootDir>/src/index.tsx', '<rootDir>/src/react-app-env.d.ts'],
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/tests/imageMock.js",
  }
};