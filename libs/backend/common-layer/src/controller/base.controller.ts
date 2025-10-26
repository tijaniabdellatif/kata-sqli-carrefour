import { Request, Response, NextFunction } from 'express';

/**
 * Base Controller
 */
export abstract class BaseController {
  protected asyncHandler(
    fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) {
    return (req: Request, res: Response, next: NextFunction) => {
      Promise.resolve(fn(req, res, next)).catch(next);
    };
  }

  protected sendSuccess(
    res: Response,
    data: any,
    message: string = 'Success',
    statuCode: number = 200
  ): Response {
    return res.status(statuCode).json({
      status: 'success',
      message,
      data,
    });
  }

  protected sendError(
    res: Response,
    message: string = 'Error',
    statuCode: number = 400,
    errors?: any
  ): Response {
    return res.status(statuCode).json({
      success: false,
      message,
      errors,
    });
  }

  protected sendPaginated(
    res: Response,
    data: any[],
    page: number,
    limit: number,
    total: number,
    message: string = 'Success'
  ): Response {
    return res.status(200).json({
      status: 'success',
      message,
      data,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  }
}
