import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import fs from 'fs';
import STRINGS from 'src/common/consts/strings.json';
export const stringToCONST = (str: string) =>
  str
    .toUpperCase()
    .replace(/[\s]+/g, '_')
    .replace(/[^\w_]/g, '');

export function updateConsts(message: string) {
  if (
    message &&
    !Object.keys(STRINGS.RESPONSES).includes(stringToCONST(message))
  ) {
    const update = {
      ...STRINGS,
      [stringToCONST(message)]: message,
    };
    fs.writeFileSync(
      'src/common/consts/strings.json',
      JSON.stringify(update, null, 2),
    );
  }
}
@Injectable()
export class DevInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    return next.handle().pipe(
      tap((data) => {
        updateConsts(data.message);
        Logger.log(
          `${Date.now() - now}ms`,
          context.getClass().name,
          context.getHandler().name,
        );
      }),
      catchError((error) => {
        Logger.log(
          `${Date.now() - now}ms`,
          context.getClass().name,
          context.getHandler().name,
        );
        return throwError(() => error);
      }),
    );
  }
}
