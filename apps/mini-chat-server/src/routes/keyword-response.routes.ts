import {
  BaseRoutes,
  ValidationMiddleware,
} from '@mini-chat/backend-common-layer';
import { KeywordResponseController } from '../controllers/keyword-reponse.controller.js';
import {
  CreateKeywordResponseDto,
  UpdateKeywordResponseDto,
} from '../dto/keyword-response.dto.js';

export class KeyWordResponseRoutes extends BaseRoutes {
  private controller: KeywordResponseController;

  constructor() {
    super();
    this.controller = new KeywordResponseController();
  }

  protected override initRoutes(): void {
    this.router.get('/', this.controller.getAll);
    this.router.get('/:id', this.controller.getById);
    this.router.post(
      '/',
      ValidationMiddleware.validateBody(CreateKeywordResponseDto),
      this.controller.create
    );
    this.router.put(
      '/:id',
      ValidationMiddleware.validateBody(UpdateKeywordResponseDto),
      this.controller.update
    );
    this.router.delete('/:id', this.controller.delete);
    this.router.patch('/:id/toggle', this.controller.toggleActive);
  }
}
