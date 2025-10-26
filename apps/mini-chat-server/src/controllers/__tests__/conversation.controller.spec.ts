/// <reference types="jest" />
import { Request, Response, NextFunction } from 'express';
import { ConversationController } from '../conversation.controller';
import { ConversationService } from '../../services/conversation.service';
import {
  BadRequestError,
  NotFoundError,
} from '@mini-chat/backend-common-layer';

jest.mock('../../services/conversation.service');

describe('ConversationController', () => {
  let controller: ConversationController;
  let mockService: jest.Mocked<ConversationService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let sendSuccessSpy: jest.SpyInstance;

  beforeEach(() => {
    mockService = {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
      getMessages: jest.fn(),
    } as any;

    (ConversationService.getInstance as jest.Mock).mockReturnValue(mockService);
    controller = new ConversationController();
    sendSuccessSpy = jest
      .spyOn(controller as any, 'sendSuccess')
      .mockImplementation((...args: unknown[]) => {
        const [res, data, message, statusCode = 200] = args as [
          Response,
          any,
          string?,
          number?
        ];
        res.status(statusCode);
        res.json({ status: 'success', message, data });
      });

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn() as NextFunction;
  });

  afterEach(() => {
    jest.clearAllMocks();
    sendSuccessSpy.mockRestore();
  });

  describe('getAll', () => {
    it('should return all conversations', async () => {
      mockRequest = {};

      const mockConversations = [
        {
          id: 'conv-1',
          createdAt: new Date(),
          updatedAt: new Date(),
          messageCount: 5,
          lastMessage: {
            id: 'msg-1',
            content: 'Last message',
            sender: 'user' as const,
            timestamp: new Date(),
            conversationId: 'conv-1',
          },
        },
        {
          id: 'conv-2',
          createdAt: new Date(),
          updatedAt: new Date(),
          messageCount: 3,
        },
      ];

      mockService.getAll.mockResolvedValue(mockConversations);

      await controller.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getAll).toHaveBeenCalled();
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        mockConversations,
        'Conversations retrieved successfully'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: mockConversations,
        })
      );
    });

    it('should return empty array when no conversations exist', async () => {
      mockRequest = {};
      mockService.getAll.mockResolvedValue([]);

      await controller.getAll(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getAll).toHaveBeenCalled();
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        [],
        'Conversations retrieved successfully'
      );
    });

    
  });

  describe('getById', () => {
    it('should return conversation by ID', async () => {
      const convId = 'conv-123';
      mockRequest = {
        params: { id: convId },
      };

      const mockConversation = {
        id: convId,
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 5,
        messages: [
          {
            id: 'msg-1',
            content: 'Hello',
            sender: 'user' as const,
            timestamp: new Date(),
            conversationId: convId,
          },
        ],
      };

      mockService.getById.mockResolvedValue(mockConversation);

      await controller.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getById).toHaveBeenCalledWith(convId);
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        mockConversation,
        'Conversation retrieved successfully'
      );
    });

    it('should throw BadRequestError when ID is missing', async () => {
      mockRequest = {
        params: {},
      };

      await controller.getById(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(BadRequestError)
      );
    });

   
  });

  describe('create', () => {
    it('should create new conversation', async () => {
      mockRequest = {};

      const mockNewConversation = {
        id: 'new-conv',
        createdAt: new Date(),
        updatedAt: new Date(),
        messageCount: 0,
      };

      mockService.create.mockResolvedValue(mockNewConversation);

      await controller.create(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.create).toHaveBeenCalled();
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        mockNewConversation,
        'Conversation created successfully',
        201
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'success',
          data: mockNewConversation,
        })
      );
    });

  });

  describe('delete', () => {
    it('should delete conversation by ID', async () => {
      const convId = 'conv-to-delete';
      mockRequest = {
        params: { id: convId },
      };

      mockService.delete.mockResolvedValue(undefined);

      await controller.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.delete).toHaveBeenCalledWith(convId);
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        null,
        'Conversation deleted successfully'
      );
    });

    it('should throw BadRequestError when ID is missing', async () => {
      mockRequest = {
        params: {},
      };

      await controller.delete(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(BadRequestError)
      );
    });

    
  });

  describe('getMessages', () => {
    it('should return messages for conversation', async () => {
      const convId = 'conv-messages';
      mockRequest = {
        params: { id: convId },
      };

      const mockMessages = [
        {
          id: 'msg-1',
          content: 'Hello',
          sender: 'user' as const,
          timestamp: new Date(),
          conversationId: convId,
        },
        {
          id: 'msg-2',
          content: 'Hi!',
          sender: 'bot' as const,
          timestamp: new Date(),
          conversationId: convId,
        },
      ];

      mockService.getMessages.mockResolvedValue(mockMessages);

      await controller.getMessages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getMessages).toHaveBeenCalledWith(convId);
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        mockMessages,
        'Messages retrieved successfully'
      );
    });

    it('should throw BadRequestError when ID is missing', async () => {
      mockRequest = {
        params: {},
      };

      await controller.getMessages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(
        expect.any(BadRequestError)
      );
    });

    it('should return empty array when no messages exist', async () => {
      mockRequest = {
        params: { id: 'empty-conv' },
      };

      mockService.getMessages.mockResolvedValue([]);

      await controller.getMessages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        [],
        'Messages retrieved successfully'
      );
    });
  });
});