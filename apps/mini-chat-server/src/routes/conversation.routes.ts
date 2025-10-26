import { BaseRoutes } from '@mini-chat/backend-common-layer';
import { ConversationController } from '../controllers/conversation.controller.js';

export class ConversationRoutes extends BaseRoutes {
  private controller: ConversationController;

  constructor() {
    super();
    this.controller = new ConversationController();
  }

  protected override initRoutes(): void {
    this.router.get('/', this.controller.getAll);
    this.router.post('/', this.controller.create);
    this.router.get('/:id', this.controller.getById);
    this.router.delete('/:id', this.controller.delete);
    this.router.get('/:id/messages', this.controller.getMessages);
  }
}