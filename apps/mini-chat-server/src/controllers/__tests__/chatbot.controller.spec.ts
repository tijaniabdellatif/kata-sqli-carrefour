/// <reference types="jest" />
import { Request, Response, NextFunction } from 'express';
import { ChatBotController } from '../../controllers/chatbot.controller';
import { ChatBotService } from '../../services/chatbot.service';
import {
  BadRequestError,
  BaseValidator,
} from '@mini-chat/backend-common-layer';

jest.mock('../../services/chatbot.service');
jest.mock('@mini-chat/backend-common-layer', () => {
  const actual = jest.requireActual('@mini-chat/backend-common-layer');
  return {
    ...actual,
    BaseValidator: {
      validateOrThrow: jest.fn(),
    },
  };
});

describe('ChatBotController', () => {
  let controller: ChatBotController;
  let mockService: jest.Mocked<ChatBotService>;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;
  let sendSuccessSpy: jest.SpyInstance;

  beforeEach(() => {
    mockService = {
      processMessage: jest.fn(),
      getConversationMessages: jest.fn(),
      initializeDefaultResponses: jest.fn(),
    } as any;

    (ChatBotService.getInstance as jest.Mock).mockReturnValue(mockService);
    controller = new ChatBotController();
    sendSuccessSpy = jest
      .spyOn(controller as any, 'sendSuccess')
      .mockImplementation((...args: unknown[]) => {
        const [res, data, message] = args as [Response, any, string?];
        res.status(200);
        res.json({ status: 'success', message, data });
      });

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };

    mockNext = jest.fn() as NextFunction;
    (BaseValidator.validateOrThrow as jest.Mock).mockReset();
  });

  afterEach(() => {
    jest.clearAllMocks();
    sendSuccessSpy.mockRestore();
  });

  describe('sendMessage', () => {
    it('should handle validation errors', async () => {
      mockRequest = {
        body: { content: '' },
      };

      const validationError = new BadRequestError('Validation failed');
      (BaseValidator.validateOrThrow as jest.Mock).mockRejectedValue(
        validationError
      );

      await controller.sendMessage(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
        })
      );
    });
  });

  describe('getConversationMessages', () => {
    it('should return messages for valid conversation ID', async () => {
      const convId = 'conv-123';
      mockRequest = {
        params: { id: convId },
      };

      const mockMessages = [
        {
          id: 'msg-1',
          content: 'hello',
          sender: 'user' as const,
          timestamp: new Date(),
          conversationId: convId,
        },
        {
          id: 'msg-2',
          content: 'Hi there!',
          sender: 'bot' as const,
          timestamp: new Date(),
          conversationId: convId,
        },
      ];

      mockService.getConversationMessages.mockResolvedValue(mockMessages);

      await controller.getConversationMessages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockService.getConversationMessages).toHaveBeenCalledWith(convId);
      expect(sendSuccessSpy).toHaveBeenCalledWith(
        mockResponse,
        mockMessages,
        'Messages retrieved successfully'
      );
      expect(mockResponse.status).toHaveBeenCalledWith(200);
    });

    it('should return error when conversation ID is missing', async () => {
      mockRequest = {
        params: {},
      };

      await controller.getConversationMessages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Error, no query params',
        })
      );
    });

    it('should return error when conversation ID is empty string', async () => {
      mockRequest = {
        params: { id: '' },
      };

      await controller.getConversationMessages(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
    });

    it('should return empty array for conversation with no messages', async () => {
      mockRequest = {
        params: { id: 'empty-conv' },
      };

      mockService.getConversationMessages.mockResolvedValue([]);

      await controller.getConversationMessages(
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
