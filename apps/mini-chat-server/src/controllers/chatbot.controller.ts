import { Request, Response } from 'express';
import {
  BadRequestError,
  BaseController,
  InternalServerError,
} from '@mini-chat/backend-common-layer';
import { ChatBotService } from '../services/chatbot.service.js';
import { SendMessageDto } from '../dto/send-message.dto.js';
import { BaseValidator } from '@mini-chat/backend-common-layer';

export class ChatBotController extends BaseController {
  private chatbotService: ChatBotService;

  constructor() {
    super();
    this.chatbotService = ChatBotService.getInstance();
  }

  sendMessage = this.asyncHandler(async (req: Request, res: Response) => {
    try {
      const dto: SendMessageDto = req.body;
      const validation = await BaseValidator.validateOrThrow(
        SendMessageDto,
        dto
      );
      const result = await this.chatbotService.processMessage(
        validation.content,
        validation.conversationId
      );

      return this.sendSuccess(res, result, 'Message processed successfully');
    } catch (error: any) {
      if (error instanceof BadRequestError) {
        res.status(400).json({
          success: false,
          error: error.message,
        });
        throw new BadRequestError('Invalid request body');
      }

      if (error instanceof InternalServerError) {
        res.status(500).json({
          success: false,
          error: error.message,
        });
        throw new InternalServerError('Something went wrong');
      }

      throw error;
    }
  });

  getConversationMessages = this.asyncHandler(
    async (req: Request, res: Response) => {
      try {
        const { id } = req.params;
        if (!id) {
          res.status(400).json({
            success: false,
            error: 'Error, no query params',
          });
          throw new BadRequestError('Error, no query params');
        }
        const messages = await this.chatbotService.getConversationMessages(id);
        return this.sendSuccess(
          res,
          messages,
          'Messages retrieved successfully'
        );
      } catch (error: any) {
        if (error instanceof BadRequestError) {
          res.status(400).json({
            success: false,
            error: error.message,
          });

          throw new BadRequestError('Invalid request body');
        }

        if (error instanceof InternalServerError) {
          res.status(500).json({
            success: false,
            error: error.message,
          });
          throw new InternalServerError('Something went wrong');
        }

        throw error;
      }
    }
  );
}
