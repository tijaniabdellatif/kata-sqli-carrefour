import { Request, Response } from 'express';
import {
  BaseController,
  BaseValidator,
  NotFoundError,
} from '@mini-chat/backend-common-layer';
import { KeyWordResponseService } from '../services/keyword-response.service.js';
import {
  CreateKeywordResponseDto,
  UpdateKeywordResponseDto,
} from '../dto/keyword-response.dto.js';

export class KeywordResponseController extends BaseController {
  private keywordService: KeyWordResponseService;

  constructor() {
    super();
    this.keywordService = KeyWordResponseService.getInstance();
  }

  /**
   * Get all keyword responses
   * GET /api/keyword-responses
   */
  getAll = this.asyncHandler(async (req: Request, res: Response) => {
    const activeOnly = req.query.activeOnly === 'true';
    const responses = await this.keywordService.getAll(activeOnly);

    return this.sendSuccess(
      res,
      responses,
      'Keyword responses retrieved successfully'
    );
  });

  /**
   * Get keyword response by ID
   * GET /api/keyword-responses/:id
   */
  getById = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const response = await this.keywordService.getById(id);

    if (!response) {
      throw new NotFoundError('Keyword response not found');
    }

    return this.sendSuccess(
      res,
      response,
      'Keyword response retrieved successfully'
    );
  });

  /**
   * Create keyword response
   * POST /api/keyword-responses
   */
  create = this.asyncHandler(async (req: Request, res: Response) => {
    const dto: CreateKeywordResponseDto = req.body;

    const validated = await BaseValidator.validateOrThrow(
      CreateKeywordResponseDto,
      dto
    );

    const response = await this.keywordService.create({
      keywords: validated.keywords,
      response: validated.response,
      priority: validated.priority!,
    });

    return this.sendSuccess(
      res,
      response,
      'Keyword response created successfully',
      201
    );
  });

  /**
   * Update keyword response
   * PUT /api/keyword-responses/:id
   */
  update = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const dto: UpdateKeywordResponseDto = req.body;

    const response = await this.keywordService.update(id, dto);

    return this.sendSuccess(
      res,
      response,
      'Keyword response updated successfully'
    );
  });

  /**
   * Delete keyword response
   * DELETE /api/keyword-responses/:id
   */
  delete = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    await this.keywordService.delete(id);

    return this.sendSuccess(res, null, 'Keyword response deleted successfully');
  });

  /**
   * Toggle active status
   * PATCH /api/keyword-responses/:id/toggle
   */
  toggleActive = this.asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const response = await this.keywordService.toggleActive(id);

    return this.sendSuccess(
      res,
      response,
      'Keyword response status toggled successfully'
    );
  });
}
