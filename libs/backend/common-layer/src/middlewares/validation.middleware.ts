import { Request, Response, NextFunction } from 'express';
import { ClassConstructor } from 'class-transformer';
import {
  BaseValidator,
  ValidationException,
} from '../validator/base.validator.js';

export type ValidationType = 'body' | 'query' | 'params';

export class ValidationMiddleware {
  static validateBody<T extends object>(
    dto: ClassConstructor<T>,
    skipMissingProperties: boolean = false
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = await BaseValidator.validateOrThrow(
          dto,
          req.body,
          skipMissingProperties
        );
        req.body = validated;
        return next();
      } catch (error: any) {
        if (error instanceof ValidationException) {
          return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: error.errors,
          });
        }

        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    };
  }

  static validateQuery<T extends object>(dto: ClassConstructor<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = await BaseValidator.validateOrThrow(
          dto,
          req.query,
          true
        );
        req.query = validated as any;
        return next();
      } catch (error: any) {
        if (error instanceof ValidationException) {
          return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: error.errors,
          });
        }
        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    };
  }

  static validateParams<T extends object>(dto: ClassConstructor<T>) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const validated = await BaseValidator.validateOrThrow(
          dto,
          req.params,
          false
        );
        req.params = validated as any;
        return next();
      } catch (error: any) {
        if (error instanceof ValidationException) {
          return res.status(400).json({
            status: 'error',
            message: 'Validation Error',
            errors: error.errors,
          });
        }
        return res.status(500).json({
          status: 'error',
          message: 'Internal Server Error',
        });
      }
    };
  }
}
