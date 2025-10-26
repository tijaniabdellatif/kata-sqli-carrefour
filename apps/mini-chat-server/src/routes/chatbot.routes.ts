import {
  BaseRoutes,
  ValidationMiddleware,
} from '@mini-chat/backend-common-layer';
import { ChatBotController } from '../controllers/chatbot.controller.js';
import { SendMessageDto } from '../dto/send-message.dto.js';

export class ChatBotRoutes extends BaseRoutes {
  private controller: ChatBotController;

  constructor() {
    super();
    this.controller = new ChatBotController();
  }

  protected override initRoutes(): void {
    this.router.post(
      '/message',
      ValidationMiddleware.validateBody(SendMessageDto),
      this.controller.sendMessage
    );
  }
}