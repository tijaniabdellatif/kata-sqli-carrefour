import { plainToInstance, ClassConstructor } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';

export interface ValidationErrorResponse {
  field: string;
  constraints: string[];
  value?: any;
}

export interface ValidationResult<T> {
  isValid: boolean;
  data?: T;
  errors?: ValidationErrorResponse[];
}


export class BaseValidator {
  /**
   * Validate and transform plain object to class instance
   * @param dto - The DTO class to validate against
   * @param plain - Plain object to validate
   * @param skipMissingProperties - Skip validation of missing properties
   * @returns ValidationResult with transformed data or errors
   */
  static async validate<T extends object>(
    dto: ClassConstructor<T>,
    plain: any,
    skipMissingProperties: boolean = false
  ): Promise<ValidationResult<T>> {
    try {
     
      const instance = plainToInstance(dto, plain, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });

     
      const errors = await validate(instance, {
        skipMissingProperties,
        whitelist: true, // Strip properties that don't have decorators
        forbidNonWhitelisted: true, // Throw error for non-whitelisted properties
        stopAtFirstError: false, // Get all errors, not just first one
      });

      if (errors.length > 0) {
        return {
          isValid: false,
          errors: this.formatValidationErrors(errors),
        };
      }

     
      return {
        isValid: true,
        data: instance,
      };
    } catch (error) {
    
      return {
        isValid: false,
        errors: [
          {
            field: 'unknown',
            constraints: [
              error instanceof Error ? error.message : 'Validation failed',
            ],
          },
        ],
      };
    }
  }

  /**
   * Validate and transform - throws error if validation fails
   * @param dto - The DTO class to validate against
   * @param plain - Plain object to validate
   * @param skipMissingProperties - Skip validation of missing properties
   * @returns Validated and transformed instance
   * @throws ValidationException if validation fails
   */
  static async validateOrThrow<T extends object>(
    dto: ClassConstructor<T>,
    plain: any,
    skipMissingProperties: boolean = false
  ): Promise<T> {
    const result = await this.validate(dto, plain, skipMissingProperties);

    if (!result.isValid) {
      throw new ValidationException(result.errors || []);
    }

    return result.data!;
  }

  /**
   * Validate array of objects
   * @param dto - The DTO class to validate against
   * @param plainArray - Array of plain objects
   * @returns Array of ValidationResults
   */
  static async validateArray<T extends object>(
    dto: ClassConstructor<T>,
    plainArray: any[]
  ): Promise<ValidationResult<T>[]> {
    if (!Array.isArray(plainArray)) {
      return [
        {
          isValid: false,
          errors: [
            {
              field: 'array',
              constraints: ['Input must be an array'],
            },
          ],
        },
      ];
    }

    const results = await Promise.all(
      plainArray.map((plain) => this.validate(dto, plain))
    );

    return results;
  }

  /**
   * Validate partial object (useful for PATCH requests)
   * @param dto - The DTO class to validate against
   * @param plain - Plain object to validate
   * @returns ValidationResult
   */
  static async validatePartial<T extends object>(
    dto: ClassConstructor<T>,
    plain: any
  ): Promise<ValidationResult<T>> {
    return this.validate(dto, plain, true);
  }

  /**
   * Format validation errors into a more readable format
   * @param errors - Array of ValidationError from class-validator
   * @returns Array of formatted validation errors
   */
  private static formatValidationErrors(
    errors: ValidationError[]
  ): ValidationErrorResponse[] {
    const formattedErrors: ValidationErrorResponse[] = [];

    errors.forEach((error) => {
      if (error.constraints) {
        formattedErrors.push({
          field: error.property,
          constraints: Object.values(error.constraints),
          value: error.value,
        });
      }

     
      if (error.children && error.children.length > 0) {
        const childErrors = this.formatValidationErrors(error.children);
        childErrors.forEach((childError) => {
          formattedErrors.push({
            field: `${error.property}.${childError.field}`,
            constraints: childError.constraints,
            value: childError.value,
          });
        });
      }
    });

    return formattedErrors;
  }

  /**
   * Create a validation summary message
   * @param errors - Array of validation errors
   * @returns Human-readable error message
   */
  static getValidationSummary(errors: ValidationErrorResponse[]): string {
    if (errors.length === 0) return 'Validation successful';

    const messages = errors.map(
      (error) => `${error.field}: ${error.constraints.join(', ')}`
    );

    return messages.join('; ');
  }
}

/**
 * Custom Validation Exception
 */
export class ValidationException extends Error {
  public errors: ValidationErrorResponse[];

  constructor(errors: ValidationErrorResponse[]) {
    const message = BaseValidator.getValidationSummary(errors);
    super(message);
    this.name = 'ValidationException';
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      errors: this.errors,
    };
  }
}