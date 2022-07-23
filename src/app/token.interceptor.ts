import {
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { concatMap, take } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({ providedIn: 'root' })
export class TokenInterceptor implements HttpInterceptor {
  constructor(public auth: AuthService) {}
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    const skipAuthorization = request.params.get('skipAuthorization');
    return this.auth.getAccessToken().pipe(
      take(1),
      concatMap((accessToken) => {
        if (accessToken) {
          request = request.clone({
            setHeaders: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          return next.handle(request);
        } else {
          request = request.clone({
            params: request.params.delete('skipAuthorization', 'true'),
          });
          // next() without changing req
          return next.handle(request);
        }
      })
    );
  }
}
