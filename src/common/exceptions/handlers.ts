import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { Request, Response } from 'express';
import STRINGS from 'src/common/consts/strings.json';
import { updateConsts } from './interceptors';

export function validationExceptionHandler(errors: ValidationError[]) {
  const result = errors.map((error) => ({
    property: error.property,
    message: error.constraints && Object.values(error.constraints)[0],
  }));
  return new BadRequestException(result);
}

function MongoServerErrorHandler(exception: Error & { code?: any }) {
  if (exception.code === 11000) {
    return STRINGS.RESPONSES.DUPLICATE_KEY_ERROR;
  }
  return exception.message;
}

@Catch()
export class GenericExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GenericExceptionFilter.name);
  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let message =
      exception instanceof HttpException
        ? exception.getResponse()
        : exception.message || STRINGS.RESPONSES.INTERNAL_SERVER_ERROR;

    if (exception.name === 'MongoServerError') {
      message = MongoServerErrorHandler(exception);
    }
    if (typeof message === 'string') {
      updateConsts(message);
    }

    if (process.env['NODE_ENV'] === 'DEV') {
      this.logger.error(exception);
    }

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
