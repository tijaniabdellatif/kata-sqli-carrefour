import { Request, Response } from 'express';
import { AppError } from '../errors/error.js';

export const errorMiddleware = (error: Error, req: Request, res: Response) => {
  if (error instanceof AppError) {
    console.log(
      `Error ${error.statusCode}: ${error.message} from ${req.method} ${req.url}`
    );
    return res.status(error.statusCode).json({
      status: 'error',
      message: error.message,
      ...(error.details && { details: error.details }),
    });
  }

  console.error(error);
  return res.status(500).json({
    status: 'error',
    message: 'Internal Server Error',
  });
};
