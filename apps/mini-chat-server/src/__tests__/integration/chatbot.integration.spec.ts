/// <reference types="jest" />
import { PrismaClient } from '@prisma/client';
jest.unmock('@prisma/client');

describe('ChatBot Integration Tests (Real MongoDB)', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.message.deleteMany({});
    await prisma.conversation.deleteMany({});
    await prisma.keywordResponse.deleteMany({});
    await prisma.$disconnect();
  });

  it('should create conversation in real database', async () => {
    const conversation = await prisma.conversation.create({
      data: {},
    });

    expect(conversation.id).toBeDefined();
    expect(conversation.createdAt).toBeInstanceOf(Date);
  });

  it('should create and fetch messages', async () => {
    const conv = await prisma.conversation.create({ data: {} });
    
    const message = await prisma.message.create({
      data: {
        content: 'Test message',
        sender: 'user',
        conversationId: conv.id,
      },
    });

    const messages = await prisma.message.findMany({
      where: { conversationId: conv.id },
    });

    expect(messages).toHaveLength(1);
    expect(messages[0].content).toBe('Test message');
  });
});