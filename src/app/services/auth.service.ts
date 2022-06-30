import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  mergeMap,
  Observable,
  of,
  shareReplay,
  throwError,
} from 'rxjs';
import { environment } from 'src/environments/environment';
import { REQUEST_ROUTES } from '../constants/request-routes.constant';
import {
  AdminLoginResponse,
  LoginResponse,
  SignInRequest,
} from '../interfaces/auth.interface';
import * as a from 'src/app/store/actions';
import * as s from 'src/app/store/selectors';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    protected store: Store,
    private notification: NotificationService
  ) {}

  isLoggedIn$: Observable<boolean> = combineLatest([
    this.store.select(s.getUserDetails),
    this.store.select(s.getAccessToken),
  ]).pipe(
    map(([userToken, accessToken]) => {
      if (!accessToken || !userToken) {
        return false;
      }
      return true;
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  clientLogin(paylod: SignInRequest): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CLIENT_LOGIN}`;
    return this.http.post<LoginResponse>(url, paylod).pipe(
      mergeMap((response) => {
        if (response && response.status === 200) {
          sessionStorage.setItem('identity', JSON.stringify(response.data));
          this.store.dispatch(new a.OnLogin(response.data));
          return of(response);
        } else {
          this.notification.error(response.message);
          throw new Error("Couldn't Find anyuser!");
        }
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  adminLogin(paylod: SignInRequest): Observable<any> {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.ADMIN_LOGIN}`;
    return this.http.post<AdminLoginResponse>(url, paylod).pipe(
      mergeMap((response) => {
        if (response) {
          sessionStorage.setItem('identity', JSON.stringify(response.data));
          this.store.dispatch(new a.OnLoginAdmin(response));
          return of(response);
        } else {
          this.notification.error(response.message);
          throw new Error("Couldn't Find anyuser!");
        }
      }),
      catchError((err) => {
        return throwError(err);
      })
    );
  }

  capchaValidate(token: string) {
    const url = `${environment.serviceUrl}${REQUEST_ROUTES.CAPTCHA_VALIDATE}`;
    return this.http.post<any>(url, {});
  }
}
