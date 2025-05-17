import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, map } from 'rxjs';
import { RESPONSE_MESSAGE_KEY } from '@/common/decorators/response-message.decorator';

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, any> {
  constructor(private reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const message =
      this.reflector.get<string>(RESPONSE_MESSAGE_KEY, context.getHandler()) ||
      'Thành công';

    return next.handle().pipe(
      map((rawData) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;

        const isPaginated =
          rawData &&
          typeof rawData === 'object' &&
          'data' in rawData &&
          'meta' in rawData;

        return {
          statusCode,
          success: true,
          message,
          data: isPaginated ? rawData.data : rawData,
          ...(isPaginated ? { meta: rawData.meta } : {}),
        };
      }),
    );
  }
}
