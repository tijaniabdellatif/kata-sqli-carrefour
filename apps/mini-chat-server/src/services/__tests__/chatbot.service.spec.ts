/// <reference types="jest" />

import { ChatBotService } from '../chatbot.service';
import { PrismaClient } from '@prisma/client';

jest.mock('@prisma/client');

describe('ChatBotService', () => {
  let service: ChatBotService;
  let mockPrisma: jest.Mocked<PrismaClient>;

  beforeEach(() => {

    (ChatBotService as any).instance = null;
    service = ChatBotService.getInstance();
    mockPrisma = (service as any).prisma;
    (mockPrisma as any).conversation = {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any;

    (mockPrisma as any).message = {
      create: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      deleteMany: jest.fn(),
    } as any;

    (mockPrisma as any).keywordResponse = {
      create: jest.fn(),
      createMany: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    } as any;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Singleton Pattern', () => {
    it('should return same instance on multiple calls', () => {
      const instance1 = ChatBotService.getInstance();
      const instance2 = ChatBotService.getInstance();

      expect(instance1).toBe(instance2);
    });
  });

  describe('processMessage', () => {
    describe('When no conversationId is provided', () => {
      it('should create new conversation', async () => {
        const mockConversation = {
          id: 'conv-123',
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        const mockUserMessage = {
          id: 'msg-user-1',
          content: 'hello',
          sender: 'user',
          timestamp: new Date(),
          conversationId: 'conv-123',
        };

        const mockBotMessage = {
          id: 'msg-bot-1',
          content: 'Hello! How can I assist you today?',
          sender: 'bot',
          timestamp: new Date(),
          conversationId: 'conv-123',
        };

        const mockKeywordResponses = [
          {
            id: 'kr-1',
            keywords: ['hello', 'hi'],
            response: 'Hello! How can I assist you today?',
            priority: 10,
            isActive: true,
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ];
        (mockPrisma.conversation.findUnique as jest.Mock).mockResolvedValue(
          mockConversation as any
        );
        (mockPrisma.message.create as jest.Mock)
          .mockResolvedValueOnce(mockUserMessage as any)
          .mockResolvedValueOnce(mockBotMessage as any);
        (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue(
          mockKeywordResponses as any
        );

        const existingConvId = 'conv-123';
        const result = await service.processMessage(
          'what are your prices?',
          existingConvId
        );
        expect(mockPrisma.conversation.findUnique).toHaveBeenCalledWith({
          where: { id: existingConvId },
        });
        expect(mockPrisma.conversation.create).not.toHaveBeenCalled();
        expect(result.message.conversationId).toBe(existingConvId);
        expect(result.botResponse?.conversationId).toBe(existingConvId);
      });

      it('should throw error when conversation not found', async () => {
        (mockPrisma.conversation.findUnique as jest.Mock).mockResolvedValue(
          null
        );
        await expect(
          service.processMessage('test', 'non-existant-conv')
        ).rejects.toThrow('Conversation not found');
      });
    });
  });

  describe('keyword matching', () => {
    it('should match greeting keywords', async () => {
      const mockConversation = {
        id: 'conv-1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockKeywordResponses = [
        {
          id: 'kr-1',
          keywords: ['hello', 'hi', 'hey'],
          response: 'Hello! How can I assist you today?',
          priority: 10,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock).mockResolvedValue({
        id: 'msg-1',
        content: 'hey there',
        sender: 'bot',
        timestamp: new Date(),
        conversationId: 'conv-1',
      } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue(
        mockKeywordResponses as any
      );
      const result = await service.processMessage('hey there');
      expect(result.botResponse?.content).toBe('hey there');
    });

    it('should match pricing keywords case-insensitively', async () => {
      const mockConversation = {
        id: 'conv-2',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockKeywordResponses = [
        {
          id: 'kr-2',
          keywords: ['price', 'cost', 'pricing'],
          response: 'Our pricing starts at $9.99/month.',
          priority: 9,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock).mockResolvedValue({
        id: 'msg-2',
        content: 'PRICE',
        sender: 'bot',
        timestamp: new Date(),
        conversationId: 'conv-2',
      } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue(
        mockKeywordResponses as any
      );
      const result = await service.processMessage('What is the PRICE?');
      expect(result.botResponse?.content).toBe('PRICE');
    });

    it('should return default response when no keywords match', async () => {
      const mockConversation = {
        id: 'conv-3',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock).mockResolvedValue({
        id: 'msg-3',
        content: 'random text',
        sender: 'bot',
        timestamp: new Date(),
        conversationId: 'conv-3',
      } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.processMessage(
        'random text that matches nothing'
      );
      expect(result.botResponse?.content).toContain('random text');
    });

    it('should prioritize keywords with higher priority', async () => {
      const mockConversation = {
        id: 'conv-4',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const mockKeywordResponses = [
        {
          id: 'kr-high',
          keywords: ['help'],
          response: 'High priority response',
          priority: 10,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'kr-low',
          keywords: ['help'],
          response: 'Low priority response',
          priority: 5,
          isActive: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock).mockResolvedValue({
        id: 'msg-4',
        content: 'help',
        sender: 'bot',
        timestamp: new Date(),
        conversationId: 'conv-4',
      } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue(
        mockKeywordResponses as any
      );
      const result = await service.processMessage('I need help');
      expect(result.botResponse?.content).toBe('help');
      expect(mockPrisma.keywordResponse.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { priority: 'desc' },
      });
    });

    it('should only match active keyword responses', async () => {
      const mockConversation = {
        id: 'conv-5',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock).mockResolvedValue({
        id: 'msg-5',
        content: 'help',
        sender: 'bot',
        timestamp: new Date(),
        conversationId: 'conv-5',
      } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue([]);
      await service.processMessage('help');
      expect(mockPrisma.keywordResponse.findMany).toHaveBeenCalledWith({
        where: { isActive: true },
        orderBy: { priority: 'desc' },
      });
    });
  });

  describe('message creation', () => {
    it('should create user message with correct data', async () => {
      const mockConversation = {
        id: 'conv-6',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const userContent = 'test message';

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock).mockResolvedValue({
        id: 'msg-6',
        content: userContent,
        sender: 'user',
        timestamp: new Date(),
        conversationId: 'conv-6',
      } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue([]);
      await service.processMessage(userContent);
      expect(mockPrisma.message.create).toHaveBeenCalledWith({
        data: {
          content: userContent,
          sender: 'user',
          conversationId: 'conv-6',
        },
      });
    });

    it('should create bot message after generating response', async () => {
      const mockConversation = {
        id: 'conv-7',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const botResponse = 'Bot response';

      (mockPrisma.conversation.create as jest.Mock).mockResolvedValue(
        mockConversation as any
      );
      (mockPrisma.message.create as jest.Mock)
        .mockResolvedValueOnce({
          id: 'msg-user-7',
          content: 'test',
          sender: 'user',
          timestamp: new Date(),
          conversationId: 'conv-7',
        } as any)
        .mockResolvedValueOnce({
          id: 'msg-bot-7',
          content: botResponse,
          sender: 'bot',
          timestamp: new Date(),
          conversationId: 'conv-7',
        } as any);
      (mockPrisma.keywordResponse.findMany as jest.Mock).mockResolvedValue([]);
      await service.processMessage('test');
      expect(mockPrisma.message.create).toHaveBeenCalledTimes(2);
      const secondCall = (mockPrisma.message.create as jest.Mock).mock
        .calls[1][0];
      expect(secondCall.data.sender).toBe('bot');
    });
  });

  describe('getConversationMessages', () => {
    it('should return all messages for a conversation in ascending order', async () => {

      const convId = 'conv-messages-1';
      const mockMessages = [
        {
          id: 'msg-1',
          content: 'hello',
          sender: 'user',
          timestamp: new Date('2025-01-01T10:00:00Z'),
          conversationId: convId,
        },
        {
          id: 'msg-2',
          content: 'Hi there!',
          sender: 'bot',
          timestamp: new Date('2025-01-01T10:00:01Z'),
          conversationId: convId,
        },
        {
          id: 'msg-3',
          content: 'how are you?',
          sender: 'user',
          timestamp: new Date('2025-01-01T10:00:02Z'),
          conversationId: convId,
        },
      ];

      (mockPrisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages as any);

      // Act
      const result = await service.getConversationMessages(convId);

      // Assert
      expect(result).toHaveLength(3);
      expect(result[0].content).toBe('hello');
      expect(result[1].content).toBe('Hi there!');
      expect(result[2].content).toBe('how are you?');
      expect(mockPrisma.message.findMany).toHaveBeenCalledWith({
        where: { conversationId: convId },
        orderBy: { timestamp: 'asc' },
      });
    });

    it('should return empty array when conversation has no messages', async () => {
      (mockPrisma.message.findMany as jest.Mock).mockResolvedValue([]);
      const result = await service.getConversationMessages('empty-conv');
      expect(result).toEqual([]);
    });

    it('should format messages correctly', async () => {
      const mockMessages = [
        {
          id: 'msg-format-1',
          content: 'test content',
          sender: 'user',
          timestamp: new Date(),
          conversationId: 'conv-format',
        },
      ];

      (mockPrisma.message.findMany as jest.Mock).mockResolvedValue(mockMessages as any);
      const result = await service.getConversationMessages('conv-format');
      expect(result[0]).toEqual({
        id: 'msg-format-1',
        content: 'test content',
        sender: 'user',
        timestamp: expect.any(Date),
        conversationId: 'conv-format',
      });
    });
  });

  describe('initializeDefaultResponses', () => {
    it('should create default responses when database is empty', async () => {
     ( mockPrisma.keywordResponse.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.keywordResponse.createMany as jest.Mock).mockResolvedValue({ count: 6 });
      const consoleSpy = jest.spyOn(console, 'log').mockImplementation();
      await service.initializeDefaultResponses();
      expect(mockPrisma.keywordResponse.count).toHaveBeenCalled();
      expect(mockPrisma.keywordResponse.createMany).toHaveBeenCalled();

      const createCall = (mockPrisma.keywordResponse.createMany as jest.Mock)
        .mock.calls[0][0];
      expect(createCall.data).toHaveLength(6);
      expect(createCall.data[0]).toMatchObject({
        keywords: ['hello', 'hi', 'hey', 'greetings'],
        response: 'Hello! How can I assist you today?',
        priority: 10,
      });

      consoleSpy.mockRestore();
    });

    it('should not create responses when database already has data', async () => {
      (mockPrisma.keywordResponse.count as jest.Mock).mockResolvedValue(5);
      await service.initializeDefaultResponses();
      expect(mockPrisma.keywordResponse.count).toHaveBeenCalled();
      expect(mockPrisma.keywordResponse.createMany).not.toHaveBeenCalled();
    });

    it('should create all 6 default keyword responses', async () => {
      (mockPrisma.keywordResponse.count as jest.Mock).mockResolvedValue(0);
      (mockPrisma.keywordResponse.createMany as jest.Mock).mockResolvedValue({ count: 6 });
      await service.initializeDefaultResponses();
      const createCall = (mockPrisma.keywordResponse.createMany as jest.Mock)
        .mock.calls[0][0];
      const keywords = createCall.data.map((item: any) =>
        item.keywords.join(',')
      );

      expect(keywords).toContain('hello,hi,hey,greetings');
      expect(keywords).toContain('price,cost,pricing,how much');
      expect(keywords).toContain('help,support,assist,need help');
      expect(keywords).toContain(
        'features,services,what do you offer,capabilities'
      );
      expect(keywords).toContain('bye,goodbye,see you,farewell');
      expect(keywords).toContain('thanks,thank you,appreciate');
    });
  });
});
