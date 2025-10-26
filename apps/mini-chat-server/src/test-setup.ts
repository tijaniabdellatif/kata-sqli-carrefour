/// <reference types="jest" />

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.test') });
process.env.NODE_ENV = process.env.NODE_ENV || 'test';
process.env.PORT = process.env.PORT || '3001';
process.env.HOST = process.env.HOST || 'localhost';
process.env.CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';
if (!process.env.DATABASE_URL) {
  console.warn('⚠️ DATABASE_URL not found in .env.test - using mock database');
}

if (typeof jest !== 'undefined') {
  jest.setTimeout(15000);
}

beforeEach(() => {
});

afterEach(() => {

  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
  }
});

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    conversation: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    message: {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    },
    keywordResponse: {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    $connect: jest.fn(),
    $disconnect: jest.fn(),
  };

  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

export {};