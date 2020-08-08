import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import {
  isJaegerActive,
  jaegerCreate,
  jaegerSuccess,
  jaegerError,
} from '../../jaegerTracer';

@Injectable()
export class JaegerInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<any> {
    const { url, method, headers } = context.switchToHttp().getRequest();
    let jaegerSpan = null;
    if (isJaegerActive) {
      jaegerSpan = jaegerCreate(method, url, headers);
    }

    return next.handle().pipe(
      tap(() => {
        if (jaegerSpan) {
          jaegerSuccess(jaegerSpan);
        }
      }),
      catchError(err => {
        if (jaegerSpan) {
          jaegerError(jaegerSpan);
        }
        return throwError(err);
      }),
    );
  }
}
