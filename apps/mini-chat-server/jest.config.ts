/* eslint-disable */
import { readFileSync } from 'fs';

// Reading the SWC compilation config for the spec files
const swcJestConfig = JSON.parse(
  readFileSync(`${__dirname}/.spec.swcrc`, 'utf-8')
);

// Disable .swcrc look-up by SWC core because we're passing in swcJestConfig ourselves
swcJestConfig.swcrc = false;

export default {
  displayName: '@mini-chat/mini-chat-server',
  preset: '../../jest.preset.js',
  testEnvironment: 'node',
  transform: {
    '^.+\\.[tj]s$': ['@swc/jest', swcJestConfig],
  },
  moduleFileExtensions: ['ts', 'js', 'html'],
  coverageDirectory: '../../test-output/jest/coverage/mini-chat-server',
  collectCoverageFrom: [
  'src/**/*.{ts,js}',           
  '!src/**/*.spec.{ts,js}',     
  '!src/**/*.test.{ts,js}',     
  '!src/**/__tests__/**',     
  '!src/main.ts',              
  '!src/test-setup.ts',         
  '!src/test-connection.ts',   
],
  testMatch: [
    '<rootDir>/src/**/__tests__/**/*.[jt]s?(x)',
    '<rootDir>/src/**/*(*.)@(spec|test).[jt]s?(x)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
  moduleNameMapper: {
    '^@mini-chat/backend-common-layer$': '<rootDir>/../../libs/backend/common-layer/src/index.ts',
    '^@mini-chat/shared-types$': '<rootDir>/../../libs/shared/types/src/index.ts',
    '^@mini-chat/types$': '<rootDir>/../../libs/shared/types/src/index.ts',
  },
  verbose: true,
  testTimeout: 10000,
  clearMocks: true,
  restoreMocks: true,
};