import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class PasswordRemoverInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((resposne) => {
        const excludedKeys = ['password'];
        Object.keys(resposne).forEach((key) => {
          if (excludedKeys.includes(key)) {
            delete resposne[key];
          }
        });
      }),
    );
  }
}
