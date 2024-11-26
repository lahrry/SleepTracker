/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
    moduleNameMapper: {
      '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
      '^axios$': 'axios/dist/axios.js'
    },
    transform: {
      '^.+\\.(js|jsx|ts|tsx)$': 'ts-jest'
    },
    transformIgnorePatterns: [
      '/node_modules/(?!axios)/'
    ]
  };