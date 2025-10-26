import { Request, Response } from 'express';
import {
  BaseController,
  NotFoundError,
  BadRequestError,
} from '@mini-chat/backend-common-layer';
import { ConversationService } from '../services/conversation.service.js';

export class ConversationController extends BaseController {
  private conversationService: ConversationService;

  constructor() {
    super();
    this.conversationService = ConversationService.getInstance();
  }

  /**
   * Get all conversations
   * GET /api/chat/conversations
   */
  getAll = this.asyncHandler(async (req: Request, res: Response) => {
    const conversations = await this.conversationService.getAll();
    return this.sendSuccess(
      res,
      conversations,
      'Conversations retrieved successfully'
    );
  });

  /**
   * Get conversation by ID
   * GET /api/chat/conversations/:id
   */
  getById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    
    if (!id) {
      throw new BadRequestError('Conversation ID is required');
    }

    const conversation = await this.conversationService.getById(id);

    if (!conversation) {
      throw new NotFoundError('Conversation not found');
    }

    return this.sendSuccess(
      res,
      conversation,
      'Conversation retrieved successfully'
    );
  });

  /**
   * Create new conversation
   * POST /api/chat/conversations
   */
  create = this.asyncHandler(async (req: Request, res: Response) => {
    const conversation = await this.conversationService.create();
    return this.sendSuccess(
      res,
      conversation,
      'Conversation created successfully',
      201
    );
  });

  /**
   * Delete conversation
   * DELETE /api/chat/conversations/:id
   */
  delete = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError('Conversation ID is required');
    }

    await this.conversationService.delete(id);
    return this.sendSuccess(res, null, 'Conversation deleted successfully');
  });

  /**
   * Get messages for conversation
   * GET /api/chat/conversations/:id/messages
   */
  getMessages = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) {
      throw new BadRequestError('Conversation ID is required');
    }

    const messages = await this.conversationService.getMessages(id);
    return this.sendSuccess(
      res,
      messages,
      'Messages retrieved successfully'
    );
  });
}